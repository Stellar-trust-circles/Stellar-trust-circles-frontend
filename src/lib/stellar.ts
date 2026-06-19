import {
  rpc,
  TransactionBuilder,
  Networks,
  Address,
  scValToNative,
  nativeToScVal,
  xdr,
  Contract,
  Account,
} from "@stellar/stellar-sdk";
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";
import { CircleStatus, CreateCircleParams, Proposal } from "./types";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const server = new rpc.Server(RPC_URL);

const FACTORY_CONTRACT_ID = "C..."; // Replace with actual factory contract ID

export async function checkFreighter() {
  return await isConnected();
}

export async function getWalletAddress() {
  return await getPublicKey();
}

/**
 * Ensures Freighter is connected and returns the public key.
 */
async function getAccount(): Promise<string> {
  if (!(await isConnected())) {
    throw new Error("Freighter is not connected");
  }
  const publicKey = await getPublicKey();
  if (!publicKey) {
    throw new Error("Could not retrieve public key from Freighter");
  }
  return publicKey;
}

/**
 * Generic Soroban contract invocation (read-only)
 */
async function query(contractId: string, method: string, args: xdr.ScVal[] = []): Promise<unknown> {
  if (!contractId || contractId.includes("...")) {
    throw new Error("Invalid or placeholder Contract ID provided.");
  }

  try {
    const contract = new Contract(contractId);
    // Use a dummy account for simulation
    const dummyAccount = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");
    const transaction = new TransactionBuilder(
      dummyAccount,
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(
        contract.call(method, ...args)
      )
      .setTimeout(0)
      .build();

    const response = await server.simulateTransaction(transaction);
    if (rpc.Api.isSimulationError(response)) {
      throw new Error(`Simulation failed: ${response.error}`);
    }

    if (response.result) {
      return scValToNative(response.result.retval);
    }
    return null;
  } catch (err) {
    throw new Error(`Failed to query contract: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
  }
}

/**
 * Generic Soroban contract invocation (transaction)
 */
async function call(contractId: string, method: string, args: xdr.ScVal[] = []): Promise<rpc.Api.GetTransactionResponse> {
  if (!contractId || contractId.includes("...")) {
    throw new Error("Invalid or placeholder Contract ID provided.");
  }

  try {
    const publicKey = await getAccount();
    const source = await server.getAccount(publicKey);
    const contract = new Contract(contractId);

    let transaction = new TransactionBuilder(source, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(method, ...args)
      )
      .setTimeout(30)
      .build();

    transaction = await server.prepareTransaction(transaction);
    const xdrString = transaction.toXDR();
    const signedXdr = await signTransaction(xdrString, {
      network: "TESTNET",
      accountToSign: publicKey,
    });

    const submission = await server.sendTransaction(
      TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    );

    if (submission.status !== "PENDING") {
      throw new Error(`Submission failed: ${JSON.stringify(submission)}`);
    }

    let response = await server.getTransaction(submission.hash);
    while (response.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await server.getTransaction(submission.hash);
    }

    if (response.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed: ${JSON.stringify(response.resultXdr)}`);
    }

    return response;
  } catch (err) {
    throw new Error(`Contract call failed: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
  }
}

export async function getCircleStatus(contractId: string): Promise<CircleStatus> {
  const result = await query(contractId, "get_circle_status");
  return result as CircleStatus;
}

export async function createCircle(params: CreateCircleParams, _userAddress: string): Promise<rpc.Api.GetTransactionResponse> {
  const args = [
    nativeToScVal(params.name, { type: "string" }),
    // @ts-ignore
    nativeToScVal(params.memberAddresses, { type: "vec", children: { type: "address" } }),
    nativeToScVal(params.contributionUsdc, { type: "u128" }),
    nativeToScVal(params.cycleLengthSecs, { type: "u32" }),
  ];
  return await call(FACTORY_CONTRACT_ID, "create_circle", args);
}

export async function contribute(contractId: string): Promise<rpc.Api.GetTransactionResponse> {
  return await call(contractId, "contribute");
}

export async function releasePayout(contractId: string): Promise<rpc.Api.GetTransactionResponse> {
  return await call(contractId, "release_payout");
}

export async function getReputation(contractId: string, address: string): Promise<number> {
  const args = [new Address(address).toScVal()];
  const result = await query(contractId, "get_reputation", args);
  return result as number;
}

export async function getProposal(contractId: string, proposalId: number): Promise<Proposal> {
  const args = [nativeToScVal(proposalId, { type: "u32" })];
  const result = await query(contractId, "get_proposal", args);
  return result as Proposal;
}

export * from "./types";
