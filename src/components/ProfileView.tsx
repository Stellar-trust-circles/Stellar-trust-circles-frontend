import { useWallet } from "../hooks/useWallet";
import { getReputationTier } from "../lib/types";

export default function ProfileView() {
  const { address: walletAddress, connect: connectWallet } = useWallet();
  const mockReputationScore = 95;
  const mockTier = getReputationTier(mockReputationScore);

  const stats = [
    { label: "Circles Joined", value: 4, icon: "group" },
    { label: "Active Savings", value: 1, icon: "hourglass_empty" },
    { label: "Total USDC Saved", value: "325.00", icon: "savings" },
    { label: "Payouts Received", value: 2, icon: "payments" },
    { label: "Default Rate", value: "0.0%", icon: "gavel" }
  ];

  const history = [
    { name: "Nairobi Savings Club", role: "Member", status: "Active", cycle: "Weekly", contribution: "50.00 USDC", impact: "+5 Rep" },
    { name: "CDMX Tanda Local", role: "Recipient", status: "Completed", cycle: "Bi-weekly", contribution: "25.00 USDC", impact: "+12 Rep" },
    { name: "Lagos Squad", role: "Admin", status: "Completed", cycle: "Weekly", contribution: "100.00 USDC", impact: "+15 Rep" },
    { name: "East Africa Ajo", role: "Member", status: "Completed", cycle: "Monthly", contribution: "10.00 USDC", impact: "+8 Rep" }
  ];

  return (
    <div className="space-y-md max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 lilac-shadow">
        <div className="border-b border-outline-variant/30 pb-6 mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Saver Profile</h2>
          <p className="text-body-sm text-on-surface-variant">
            Track your decentralized saving reputation and audit your circle histories.
          </p>
        </div>

        {!walletAddress ? (
          <div className="text-center py-12 space-y-md">
            <div className="w-16 h-16 bg-surface-container-high text-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">person</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-body-lg text-on-surface">Profile View Locked</h3>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                Connect your Freighter wallet to view your reputation scores, save history, and audit participation metrics.
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="bg-primary text-on-primary hover:opacity-95 px-6 py-2.5 rounded-full font-label-caps text-label-caps shadow-md transition-all cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left: User Avatar & Reputation score */}
            <div className="lg:col-span-5 space-y-md">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 text-center space-y-md">
                {/* User Avatar */}
                <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                  <span className="material-symbols-outlined text-[48px] select-none">person_filled</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-body-lg text-on-surface">Stellar Saver</h3>
                  <code className="text-xs text-on-surface-variant font-data-code break-all select-all">
                    {walletAddress}
                  </code>
                </div>

                {/* Reputation Badge */}
                <div className="border-t border-outline-variant/20 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                    <span>TRUST SCORE</span>
                    <span className="text-secondary font-bold font-data-code">{mockReputationScore}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-outline-variant/30 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${mockReputationScore}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold w-fit mx-auto">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    {mockTier} Tier
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stats & History */}
            <div className="lg:col-span-7 space-y-md">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                {stats.map((st) => (
                  <div
                    key={st.label}
                    className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px] mb-2">{st.icon}</span>
                    <div>
                      <p className="font-bold text-body-lg text-on-surface leading-none">{st.value}</p>
                      <p className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-1 leading-none">
                        {st.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* History */}
              <div className="space-y-sm">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
                  Participation History
                </h4>

                <div className="border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/20 bg-surface-container-lowest">
                  {history.map((h, i) => (
                    <div
                      key={h.name + i}
                      className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-on-surface">{h.name}</p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              h.status === "Active"
                                ? "bg-secondary-container text-on-secondary-container"
                                : "bg-surface-variant text-on-surface-variant"
                            }`}
                          >
                            {h.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant">
                          Role: <span className="font-semibold">{h.role}</span> • Cycle: {h.cycle} • Contribution: {h.contribution}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-secondary-fixed-dim bg-secondary/10 px-2.5 py-1 rounded-full font-data-code">
                          {h.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
