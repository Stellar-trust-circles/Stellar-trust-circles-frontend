import {
  rpc,
  TransactionBuilder,
  Networks,
  Address,
  scValToNative,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const server = new rpc.Server(RPC_URL);

/**
 * Ensures Freighter is connected and returns the public key.
 */
async function getAccount() {
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
async function query(contractId, method, args = []) {
  if (!contractId || contractId.includes("...")) {
    throw new Error("Invalid or placeholder Contract ID provided.");
  }

  try {
    const contract = new Address(contractId);
    const transaction = new TransactionBuilder(
      await server.getLatestLedger(),
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(
        rpc.Operation.invokeHostFunction({
          func: contract.call(method, ...args),
          auth: [],
        })
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
    throw new Error(`Failed to query contract: ${err.message}`);
  }
}

/**
 * Generic Soroban contract invocation (transaction)
 */
async function call(contractId, method, args = []) {
  if (!contractId || contractId.includes("...")) {
    throw new Error("Invalid or placeholder Contract ID provided.");
  }

  try {
    const publicKey = await getAccount();
    const source = await server.getAccount(publicKey);
    const contract = new Address(contractId);

    let transaction = new TransactionBuilder(source, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        rpc.Operation.invokeHostFunction({
          func: contract.call(method, ...args),
          auth: [],
        })
      )
      .setTimeout(30)
      .build();

    transaction = await server.prepareTransaction(transaction);
    const xdr = transaction.toXDR();
    const signedXdr = await signTransaction(xdr, {
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
    while (response.status === "NOT_FOUND" || response.status === "PENDING") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await server.getTransaction(submission.hash);
    }

    if (response.status === "FAILED") {
      throw new Error(`Transaction failed: ${JSON.stringify(response.resultXdr)}`);
    }

    return response;
  } catch (err) {
    throw new Error(`Contract call failed: ${err.message}`);
  }
}

export async function getCircleStatus(contractId) {
  return await query(contractId, "get_circle_status");
}

export async function createCircle(contractId, config) {
  // config: { name, contribution_amount, member_limit, etc. }
  // Mapping config to ScVals would depend on the contract's specific struct
  const args = [
    nativeToScVal(config.name, { type: "string" }),
    nativeToScVal(config.amount, { type: "u128" }),
    nativeToScVal(config.limit, { type: "u32" }),
  ];
  return await call(contractId, "create_circle", args);
}

export async function contribute(contractId) {
  // freighter account is handled internally
  return await call(contractId, "contribute");
}

export async function releasePayout(contractId) {
  return await call(contractId, "release_payout");
}

export async function getReputation(contractId, address) {
  const args = [new Address(address).toScVal()];
  return await query(contractId, "get_reputation", args);
}
