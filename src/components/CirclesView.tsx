import React, { useState, useEffect } from "react";
import { useStellar } from "../hooks/useStellar";
import { useWallet } from "../hooks/useWallet";
import { getReputationTier } from "../lib/types";

// Mock circles presets
const PRESET_CIRCLES = [
  {
    id: "preset-nairobi",
    name: "Nairobi Savings Club",
    isActive: true,
    currentCycle: 3,
    payoutIndex: 2,
    cycleDeadline: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    contributionUsdc: 50,
    members: [
      "GB3X5N74...Y7Z4",
      "GA8P4K9D...D2K9",
      "GC1QR4N8...R4N8",
      "GD4VT5S2...T5S2",
      "GE9WU3X1...U3X1",
      "GF2TV8M5...V8M5",
      "GG7SW9L2...W9L2",
      "GH5RX1K4...X1K4"
    ],
    reputations: [98, 85, 100, 92, 78, 95, 88, 62],
    isPreset: true
  },
  {
    id: "preset-lagos",
    name: "Lagos Tech Ajo",
    isActive: true,
    currentCycle: 1,
    payoutIndex: 0,
    cycleDeadline: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    contributionUsdc: 100,
    members: [
      "GD4VT5S2...T5S2",
      "GE9WU3X1...U3X1",
      "GF2TV8M5...V8M5",
      "GG7SW9L2...W9L2",
      "GH5RX1K4...X1K4"
    ],
    reputations: [90, 82, 95, 75, 45],
    isPreset: true
  },
  {
    id: "preset-cdmx",
    name: "CDMX Tanda Local",
    isActive: true,
    currentCycle: 5,
    payoutIndex: 4,
    cycleDeadline: new Date(Date.now() + 691200000).toISOString(), // 8 days from now
    contributionUsdc: 25,
    members: [
      "GA8P4K9D...D2K9",
      "GC1QR4N8...R4N8",
      "GD4VT5S2...T5S2",
      "GE9WU3X1...U3X1",
      "GF2TV8M5...V8M5",
      "GG7SW9L2...W9L2"
    ],
    reputations: [88, 96, 92, 85, 90, 95],
    isPreset: true
  }
];

export default function CirclesView() {
  const { address: walletAddress, connect: connectWallet } = useWallet();
  const [selectedCircleId, setSelectedCircleId] = useState<string>("preset-nairobi");
  const [customContractId, setCustomContractId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");

  // Real contract integration hook (only loaded when selectedCircleId matches a 56-char Stellar ID)
  const isRealContract = selectedCircleId.startsWith("C") && selectedCircleId.length === 56;
  const {
    loading: contractLoading,
    error: contractError,
    circleStatus,
    fetchStatus,
    handleContribute,
    handleReleasePayout
  } = useStellar(isRealContract ? selectedCircleId : undefined);

  // Simulation states for presets
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);
  const [presetStates, setPresetStates] = useState(PRESET_CIRCLES);

  // Time remaining calculator
  const [timeLeft, setTimeLeft] = useState("");

  const selectedCircle = isRealContract
    ? circleStatus
      ? {
          id: selectedCircleId,
          name: circleStatus.name,
          isActive: circleStatus.isActive,
          currentCycle: circleStatus.currentCycle,
          payoutIndex: circleStatus.payoutIndex,
          cycleDeadline: circleStatus.cycleDeadline,
          contributionUsdc: circleStatus.contributionUsdc,
          members: circleStatus.members,
          reputations: circleStatus.members.map(() => 100), // Default real contract score
          isPreset: false
        }
      : null
    : presetStates.find((c) => c.id === selectedCircleId);

  useEffect(() => {
    if (isRealContract) {
      void fetchStatus();
    }
  }, [selectedCircleId, isRealContract, fetchStatus]);

  useEffect(() => {
    if (!selectedCircle?.cycleDeadline) return;
    const tick = () => {
      const diff = new Date(selectedCircle.cycleDeadline).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Deadline passed");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [selectedCircle?.cycleDeadline, selectedCircleId]);

  const handleLoadCustomContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (customContractId.trim().startsWith("C") && customContractId.trim().length === 56) {
      setSelectedCircleId(customContractId.trim());
      setCustomContractId("");
    } else {
      alert("Invalid Soroban Contract ID. Must start with 'C' and be 56 characters.");
    }
  };

  const handlePresetContribute = async () => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }
    setSimulationLoading(true);
    setSimulationSuccess(null);
    // Simulate transaction delay
    setTimeout(() => {
      setSimulationLoading(false);
      setSimulationSuccess("USDC Contribution successfully broadcasted to Stellar Ledger!");
      setTimeout(() => setSimulationSuccess(null), 4000);
    }, 2000);
  };

  const handlePresetRelease = () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    setSimulationLoading(true);
    setSimulationSuccess(null);
    setTimeout(() => {
      setSimulationLoading(false);
      setSimulationSuccess("Lump sum payout released to next recipient wallet address!");
      
      // Advance recipient index in simulation
      setPresetStates((prev) =>
        prev.map((c) => {
          if (c.id === selectedCircleId) {
            const nextIdx = (c.payoutIndex + 1) % c.members.length;
            const nextCycle = nextIdx === 0 ? c.currentCycle + 1 : c.currentCycle;
            return {
              ...c,
              payoutIndex: nextIdx,
              currentCycle: nextCycle,
              cycleDeadline: new Date(Date.now() + 345600000).toISOString()
            };
          }
          return c;
        })
      );
      setTimeout(() => setSimulationSuccess(null), 4000);
    }, 2000);
  };

  // Filter circles list
  const allCirclesList = [
    ...presetStates,
    ...(isRealContract && circleStatus
      ? [
          {
            id: selectedCircleId,
            name: circleStatus.name,
            isActive: circleStatus.isActive,
            contributionUsdc: circleStatus.contributionUsdc,
            members: circleStatus.members,
            isPreset: false
          }
        ]
      : [])
  ];

  const filteredCircles = allCirclesList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "pending" && !c.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start animate-[fadeIn_0.5s_ease-out]">
      {/* Left Column: List Directory */}
      <div className="lg:col-span-5 space-y-md">
        <div className="bg-white p-6 rounded-2xl lilac-shadow border border-surface-variant/30 space-y-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">Saving Circles</h2>
          <p className="text-body-sm text-on-surface-variant">
            Browse active rotating savings groups or connect to a custom contract address.
          </p>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search circles..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
            </div>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-body-sm focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Custom contract ID importer */}
          <form onSubmit={handleLoadCustomContract} className="flex gap-2 pt-2 border-t border-outline-variant/30">
            <input
              type="text"
              value={customContractId}
              onChange={(e) => setCustomContractId(e.target.value)}
              placeholder="Load custom contract ID (C...)"
              className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs font-data-code focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary-container text-on-primary-container hover:opacity-90 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Load
            </button>
          </form>
        </div>

        {/* Directory List */}
        <div className="space-y-sm max-h-[500px] overflow-y-auto pr-1">
          {filteredCircles.length > 0 ? (
            filteredCircles.map((circle) => {
              const isSelected = selectedCircleId === circle.id;
              return (
                <div
                  key={circle.id}
                  onClick={() => setSelectedCircleId(circle.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? "bg-primary-fixed border-primary shadow-sm"
                      : "bg-white border-outline-variant/30 hover:border-outline-variant/80 hover:shadow-sm"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-body-md text-on-surface">{circle.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-data-code">
                      <span>{circle.contributionUsdc} USDC</span>
                      <span>•</span>
                      <span>{circle.members.length} members</span>
                    </div>
                    {!circle.isPreset && (
                      <span className="inline-block text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-data-code font-bold uppercase tracking-wider">
                        Soroban Ledger
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      circle.isActive
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {circle.isActive ? "Active" : "Completed"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-white border border-outline-variant/30 rounded-2xl">
              <span className="material-symbols-outlined text-[36px] text-outline-variant mb-2">
                info
              </span>
              <p className="text-body-sm text-on-surface-variant">No circles found matching search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Dynamic Detail View */}
      <div className="lg:col-span-7">
        {contractLoading && (
          <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 text-center space-y-sm lilac-shadow">
            <span className="animate-spin material-symbols-outlined text-primary text-[36px]">
              sync
            </span>
            <p className="text-body-md text-on-surface">Loading contract state from Stellar Testnet...</p>
          </div>
        )}

        {contractError && (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl border border-error/20 space-y-sm">
            <h3 className="font-bold text-body-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-error">error</span>
              Stellar Query Error
            </h3>
            <p className="text-xs font-data-code bg-white/50 p-3 rounded-lg">{contractError}</p>
            <p className="text-body-sm">
              Please check if the Soroban contract ID is deployed to Testnet or try one of the interactive mock presets.
            </p>
          </div>
        )}

        {!contractLoading && !contractError && selectedCircle && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 lilac-shadow space-y-md animate-[fadeIn_0.3s_ease-out]">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface">{selectedCircle.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      selectedCircle.isActive
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {selectedCircle.isActive ? "Active" : "Completed"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">key</span>
                  ID: <span className="font-data-code">{selectedCircle.id}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase">Current Cycle</p>
                <p className="font-bold text-headline-md text-primary">{selectedCircle.currentCycle}</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-sm">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 text-center">
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">Contribution</p>
                <p className="font-bold text-body-lg text-primary">{selectedCircle.contributionUsdc} USDC</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 text-center">
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">Members</p>
                <p className="font-bold text-body-lg text-on-surface">{selectedCircle.members.length}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 text-center">
                <p className="text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">Time Left</p>
                <p className="font-bold text-body-lg text-secondary truncate">{timeLeft || "—"}</p>
              </div>
            </div>

            {/* Payout Recipient Card */}
            <div className="bg-surface-container-high p-4 rounded-2xl border border-primary/20 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-label-caps text-primary uppercase">Next Payout Recipient</p>
                <code className="font-data-code text-xs text-on-surface block break-all font-semibold">
                  {selectedCircle.members[selectedCircle.payoutIndex]}
                </code>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px]">
                local_atm
              </span>
            </div>

            {/* Interactive Actions */}
            <div className="space-y-sm">
              {simulationSuccess && (
                <div className="bg-secondary-container text-on-secondary-container p-3.5 rounded-xl text-body-sm font-semibold flex items-center gap-2 animate-[slideDown_0.2s_ease-out]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {simulationSuccess}
                </div>
              )}

              <div className="flex gap-sm">
                <button
                  onClick={selectedCircle.isPreset ? handlePresetContribute : () => handleContribute()}
                  disabled={simulationLoading || contractLoading}
                  className="flex-1 bg-primary text-on-primary hover:opacity-90 active:scale-98 transition-all px-6 py-3 rounded-full font-label-caps text-label-caps flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {simulationLoading ? (
                    <>
                      Processing...
                      <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>
                    </>
                  ) : (
                    <>
                      Contribute USDC
                      <span className="material-symbols-outlined text-[18px]">savings</span>
                    </>
                  )}
                </button>

                <button
                  onClick={selectedCircle.isPreset ? handlePresetRelease : () => handleReleasePayout()}
                  disabled={simulationLoading || contractLoading}
                  className="flex-1 border border-primary text-primary hover:bg-primary/5 active:scale-98 transition-all px-6 py-3 rounded-full font-label-caps text-label-caps flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  Release Payout
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                </button>
              </div>
            </div>

            {/* Member List with Reputation Badges */}
            <div className="space-y-sm pt-2">
              <h4 className="font-bold text-body-md text-on-surface">Circle Members ({selectedCircle.members.length})</h4>
              
              <div className="border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/30 bg-surface-container-lowest">
                {selectedCircle.members.map((address, idx) => {
                  const isRecipient = idx === selectedCircle.payoutIndex;
                  const score = selectedCircle.reputations[idx] || 100;
                  const tier = getReputationTier(score);

                  // Colors for badge
                  let badgeClass = "";
                  if (tier === "Trusted") {
                    badgeClass = "bg-secondary-container text-on-secondary-container";
                  } else if (tier === "Building trust") {
                    badgeClass = "bg-tertiary-fixed text-on-tertiary-fixed-variant";
                  } else {
                    badgeClass = "bg-surface-variant text-on-surface-variant";
                  }

                  return (
                    <div
                      key={address + idx}
                      className={`flex items-center justify-between p-4 ${
                        isRecipient ? "bg-primary-fixed/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <code className="font-data-code text-xs text-on-surface font-semibold">{address}</code>
                        {isRecipient && (
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Next Payout
                          </span>
                        )}
                      </div>

                      <div className={`px-3 py-1 rounded-full text-[11px] font-semibold ${badgeClass}`}>
                        {tier} ({score}%)
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
