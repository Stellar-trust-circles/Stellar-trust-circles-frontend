import React from "react";

interface Circle {
  id: string;
  name: string;
  progress: number;
  total: number;
  amount: number;
  frequency: string;
  nextPayout: string;
  status: "active" | "paid" | "pending";
  borderColor?: string;
  showSpin?: boolean;
}

interface HomeDashboardProps {
  currentView: string;
  walletAddress: string | null;
  onNavigate: (view: string) => void;
  onConnectWallet: () => void;
  onCreateCircle: () => void;
}

const circles: Circle[] = [
  {
    id: "1",
    name: "Neighborhood Savers Elite",
    progress: 4,
    total: 12,
    amount: 100,
    frequency: "Weekly",
    nextPayout: "2d 14h",
    status: "active",
    borderColor: "border-primary",
    showSpin: true,
  },
  {
    id: "2",
    name: "Family Holiday Fund",
    progress: 8,
    total: 8,
    amount: 50,
    frequency: "Monthly",
    nextPayout: "14d 02h",
    status: "active",
    borderColor: "border-tertiary",
    showSpin: false,
  },
  {
    id: "3",
    name: "New Laptop Circle",
    progress: 0,
    total: 6,
    amount: 250,
    frequency: "Bi-Weekly",
    nextPayout: "",
    status: "pending",
    borderColor: "border-surface-container-high",
    showSpin: false,
  },
];

const stats = [
  {
    label: "Active Circles",
    value: "08",
    badge: "+2 this month",
    icon: "group",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    badgeColor: "text-secondary",
  },
  {
    label: "Total Saved (USDC)",
    value: "1,420.50",
    badge: "Verified Ledger",
    icon: "savings",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    badgeColor: "text-secondary",
  },
  {
    label: "Reputation Score",
    value: "982",
    suffix: "/ 1000",
    stars: 3,
    icon: "verified_user",
    iconBg: "bg-tertiary-container/20",
    iconColor: "text-tertiary",
  },
];

const RotationRing: React.FC<{
  progress: number;
  total: number;
  borderColor: string;
  showSpin: boolean;
}> = ({ progress, total, borderColor, showSpin }) => {
  const progressPercent = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <div className="absolute inset-0 rounded-full border-4 border-surface-container-high" />
      <div
        className={`absolute inset-0 rounded-full border-4 border-t-transparent ${
          showSpin ? "animate-[spin_8s_linear_infinite]" : ""
        }`}
        style={{
          borderColor,
          borderRightColor: progressPercent > 75 ? borderColor : undefined,
          borderBottomColor: progressPercent > 50 ? borderColor : undefined,
        }}
      />
      {progress > 0 && progress < total && (
        <div
          className={`absolute w-3 h-3 rounded-full shadow-[0_0_8px_rgba(107,79,187,0.6)] ${borderColor.replace("border-", "bg-")}`}
          style={{
            top: "0%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-data-code font-bold ${
            progress === total ? "text-tertiary" : progress > 0 ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          {progress}/{total}
        </span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  stat: (typeof stats)[0];
}> = ({ stat }) => {
  return (
    <div className="bg-surface p-lg rounded-xl lilac-shadow border border-primary/10 transition-transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start mb-md">
        <div className={`p-xs ${stat.iconBg} rounded-lg`}>
          <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
        </div>
        {stat.badge && (
          <span className={`font-label-caps text-label-caps ${stat.badgeColor}`}>{stat.badge}</span>
        )}
        {stat.stars && (
          <div className="flex">
            {Array.from({ length: stat.stars }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-tertiary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
        )}
      </div>
      <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
        {stat.label}
      </h3>
      <div className="font-display-sm text-display-sm text-on-surface">
        {stat.value}
        {stat.suffix && (
          <span className="text-body-sm text-on-surface-variant">{stat.suffix}</span>
        )}
      </div>
    </div>
  );
};

const CircleCard: React.FC<{
  circle: Circle;
  onNavigate: (view: string) => void;
}> = ({ circle, onNavigate }) => {
  return (
    <div
      className={`group bg-surface p-md md:p-lg rounded-xl lilac-shadow border border-primary/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center gap-lg ${
        circle.status === "pending" ? "opacity-80" : ""
      }`}
    >
      <RotationRing
        progress={circle.progress}
        total={circle.total}
        borderColor={circle.borderColor || "border-surface-container-high"}
        showSpin={circle.showSpin || false}
      />
      <div className="flex-grow space-y-xs text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-sm">
          <h3 className="font-body-lg text-[20px] font-bold text-on-surface">{circle.name}</h3>
          <span
            className={`inline-flex items-center self-center md:self-auto px-sm py-1 rounded-full font-label-caps text-[10px] ${
              circle.status === "active"
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-surface-variant text-on-surface-variant"
            }`}
          >
            {circle.status === "active" && (
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />
            )}
            {circle.status === "active" ? "Active" : "Pending"}
          </span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-md text-on-surface-variant">
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-base">payments</span>
            {circle.amount} USDC · {circle.frequency}
          </span>
          {circle.status === "active" && (
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-base">schedule</span>
              Next payout in <span className="font-data-code font-bold ml-1">{circle.nextPayout}</span>
            </span>
          )}
          {circle.status === "pending" && (
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-base">group</span>
              Waiting for 2 more members
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={() => onNavigate("circles")}
          className="px-md py-sm rounded-lg border border-outline-variant hover:bg-surface-variant/20 transition-colors font-label-caps w-full md:w-auto"
        >
          {circle.status === "pending" ? "Manage Invite" : "Details"}
        </button>
        {circle.status === "active" && circle.progress < circle.total && (
          <button
            type="button"
            className="px-md py-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm font-label-caps"
          >
            Pay Contribution
          </button>
        )}
        {circle.progress === circle.total && (
          <button
            type="button"
            className="px-md py-sm rounded-lg bg-primary/20 text-primary cursor-default font-label-caps"
          >
            Paid
          </button>
        )}
      </div>
    </div>
  );
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentView,
  walletAddress,
  onNavigate,
  onConnectWallet,
  onCreateCircle,
}) => {

  return (
    <div className="min-h-screen bg-[#FAF8FC]">
      {/* Header */}
      <header className="bg-background sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-gutter py-sm max-w-container-max mx-auto">
          <div className="flex items-center gap-xs">
            <span className="text-headline-md font-display-lg text-primary">Trust Circles</span>
          </div>
          <div className="hidden md:flex items-center gap-lg">
            <nav className="flex items-center gap-md">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-primary font-bold transition-colors duration-200 ease-in-out hover:bg-surface-variant/20 px-2 py-1 rounded"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onNavigate("circles")}
                className="text-on-surface-variant transition-colors duration-200 ease-in-out hover:bg-surface-variant/20 px-2 py-1 rounded"
              >
                Circles
              </button>
              <button
                type="button"
                onClick={() => onNavigate("wallet")}
                className="text-on-surface-variant transition-colors duration-200 ease-in-out hover:bg-surface-variant/20 px-2 py-1 rounded"
              >
                Wallet
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-sm">
            {walletAddress && (
              <div className="bg-surface-container-high px-sm py-xs rounded-full flex items-center gap-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>
                  account_balance_wallet
                </span>
                <span className="font-data-code text-on-surface-variant">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
            {!walletAddress && (
              <button
                type="button"
                onClick={onConnectWallet}
                className="hidden md:flex items-center gap-2 rounded-full bg-primary px-sm py-xs font-label-caps text-on-primary transition-all hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                Connect Wallet
              </button>
            )}
            <button type="button" className="md:hidden p-base">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-lg pb-xl">
        {/* Header Section */}
        <header className="mb-xl">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Your Circles</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Manage your communal savings and monitor rotation cycles across your active circles.
          </p>
        </header>

        {/* Bento Grid for Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          {stats.map((stat) => (
            <div key={stat.label} className="animate-fade-in">
              <StatCard stat={stat} />
            </div>
          ))}
        </section>

        {/* Vertical List of Circles */}
        <section className="space-y-md">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-sm">
            Current Rotations
          </h2>
          {circles.map((circle) => (
            <div key={circle.id} className="animate-fade-in">
              <CircleCard circle={circle} onNavigate={onNavigate} />
            </div>
          ))}
        </section>
      </main>

      {/* FAB */}
      <button
        type="button"
        onClick={onCreateCircle}
        className="fixed bottom-gutter right-gutter md:bottom-lg md:right-lg z-40 bg-primary text-on-primary p-md rounded-xl shadow-lg hover:bg-primary-container transition-all hover:scale-105 active:scale-95 flex items-center gap-sm group"
      >
        <span className="material-symbols-outlined">add</span>
        <span className="font-label-caps hidden group-hover:inline-block transition-all pr-xs">
          Create Circle
        </span>
      </button>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-4px_20px_rgba(107,79,187,0.08)] flex justify-around items-center px-4 py-3 pb-safe rounded-t-xl">
        {[
          { key: "home", label: "Home", icon: "home", active: true },
          { key: "circles", label: "Circles", icon: "group" },
          { key: "wallet", label: "Wallet", icon: "account_balance_wallet" },
          { key: "profile", label: "Profile", icon: "person" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-transform duration-150 ${
              item.active && currentView === item.key
                ? "bg-primary-container text-on-primary-container rounded-full scale-95"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-caps text-[10px] mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HomeDashboard;
