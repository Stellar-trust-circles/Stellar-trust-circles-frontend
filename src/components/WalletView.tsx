import { useState } from "react";
import { useWallet } from "../hooks/useWallet";

interface Txn {
  id: string;
  type: string;
  amount: string;
  asset: string;
  status: "success" | "pending" | "failed";
  time: string;
}

const INITIAL_TXNS: Txn[] = [
  { id: "tx_1a2b...3c4d", type: "Circle Contribution (Nairobi Savings)", amount: "-50.00", asset: "USDC", status: "success", time: "2026-06-18 14:32" },
  { id: "tx_5e6f...7g8h", type: "Circle Payout Received (CDMX Tanda)", amount: "+250.00", asset: "USDC", status: "success", time: "2026-06-15 09:12" },
  { id: "tx_9i0j...1k2l", type: "Circle Contribution (CDMX Tanda)", amount: "-25.00", asset: "USDC", status: "success", time: "2026-06-01 10:05" },
  { id: "tx_3m4n...5o6p", type: "Testnet Faucet Request", amount: "+100.00", asset: "XLM", status: "success", time: "2026-05-28 17:45" }
];

export default function WalletView() {
  const { address: walletAddress, connecting, error, connect, disconnect } = useWallet();
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetSuccess, setFaucetSuccess] = useState(false);
  const [balances, setBalances] = useState({ xlm: 420.50, usdc: 250.00 });
  const [transactions, setTransactions] = useState<Txn[]>(INITIAL_TXNS);

  const handleRequestFaucet = () => {
    if (!walletAddress) {
      alert("Please connect your Freighter wallet first.");
      return;
    }
    setFaucetLoading(true);
    setFaucetSuccess(false);

    setTimeout(() => {
      setFaucetLoading(false);
      setFaucetSuccess(true);
      setBalances((prev) => ({
        xlm: prev.xlm + 100,
        usdc: prev.usdc + 100
      }));
      setTransactions((prev) => [
        {
          id: "tx_" + Math.random().toString(36).substring(2, 6) + "..." + Math.random().toString(36).substring(2, 6),
          type: "Testnet Faucet Request",
          amount: "+100.00",
          asset: "USDC & XLM",
          status: "success",
          time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        },
        ...prev
      ]);
      setTimeout(() => setFaucetSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-md max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 lilac-shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-6 mb-6">
          <div className="space-y-1">
            <h2 className="font-headline-md text-headline-md text-on-surface">Stellar Wallet</h2>
            <p className="text-body-sm text-on-surface-variant">
              Manage your connected wallet accounts, request testnet tokens, and audit your blockchain transaction ledger.
            </p>
          </div>

          {walletAddress ? (
            <button
              onClick={disconnect}
              className="border border-error text-error hover:bg-error/5 active:scale-95 px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-all cursor-pointer flex items-center gap-2"
            >
              Disconnect Wallet
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="bg-primary text-on-primary hover:opacity-90 active:scale-95 px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-2xl border border-error/15 text-body-sm font-semibold flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {!walletAddress ? (
          <div className="text-center py-12 space-y-md">
            <div className="w-16 h-16 bg-surface-container-high text-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">account_balance_wallet</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-body-lg text-on-surface">Wallet Connection Required</h3>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                Connect your Freighter wallet extension to view active balances, trigger contract savings contributions, and request payouts.
              </p>
            </div>
            <button
              onClick={connect}
              className="bg-primary text-on-primary hover:opacity-95 px-6 py-2.5 rounded-full font-label-caps text-label-caps shadow-md transition-all cursor-pointer"
            >
              Connect Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Left Box: Balances & Faucet */}
            <div className="md:col-span-5 space-y-md">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-md">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Account Balances</h3>

                <div className="space-y-sm">
                  {/* XLM */}
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                        X
                      </div>
                      <div>
                        <p className="font-bold text-body-md text-on-surface">Stellar Lumens</p>
                        <p className="text-[10px] text-on-surface-variant font-data-code">XLM</p>
                      </div>
                    </div>
                    <p className="font-bold text-body-lg text-on-surface">{balances.xlm.toFixed(2)}</p>
                  </div>

                  {/* USDC */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-xs">
                        $
                      </div>
                      <div>
                        <p className="font-bold text-body-md text-on-surface">USD Coin</p>
                        <p className="text-[10px] text-on-surface-variant font-data-code">USDC (Stellar)</p>
                      </div>
                    </div>
                    <p className="font-bold text-body-lg text-on-surface">{balances.usdc.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Faucet Box */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-sm">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Testnet Faucet</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Need Testnet funds? Request XLM and USDC tokens to participate in savings circles.
                </p>

                {faucetSuccess && (
                  <div className="bg-secondary-container text-on-secondary-container p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-[slideDown_0.2s_ease-out]">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    +100 XLM and +100 USDC added!
                  </div>
                )}

                <button
                  onClick={handleRequestFaucet}
                  disabled={faucetLoading}
                  className="w-full bg-secondary text-on-secondary hover:opacity-90 active:scale-98 transition-all py-2.5 rounded-xl font-label-caps text-label-caps flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {faucetLoading ? (
                    <>
                      Dispensing Tokens...
                      <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>
                    </>
                  ) : (
                    <>
                      Request Testnet Funds
                      <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Box: Transaction History */}
            <div className="md:col-span-7 space-y-sm">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Transaction Ledger</h3>

              <div className="border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/20 bg-surface-container-lowest">
                {transactions.map((tx) => {
                  const isNegative = tx.amount.startsWith("-");
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-on-surface">{tx.type}</p>
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-data-code">
                          <span className="bg-surface-variant px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide">
                            {tx.asset}
                          </span>
                          <span>{tx.id}</span>
                          <span>•</span>
                          <span>{tx.time}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <p className={`font-bold text-body-md ${isNegative ? "text-error" : "text-secondary"}`}>
                          {tx.amount}
                        </p>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-secondary-fixed-dim bg-secondary/10 px-2 py-0.5 rounded-full font-semibold">
                          <span className="material-symbols-outlined text-[12px]">done</span>
                          Confirmed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
