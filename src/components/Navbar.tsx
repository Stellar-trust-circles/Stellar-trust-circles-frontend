import React from 'react';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  onConnectWallet?: () => void;
  walletAddress?: string | null;
}

const navItems = [
  { key: "home", label: "Home" },
  { key: "circles", label: "Circles" },
  { key: "wallet", label: "Wallet" },
  { key: "profile", label: "Profile" },
] as const;

const Navbar: React.FC<NavbarProps> = ({
  currentView = "home",
  onNavigate,
  onConnectWallet,
  walletAddress,
}) => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-background/90 backdrop-blur-md dark:bg-inverse-surface/90">
      <nav className="mx-auto flex w-full max-w-container-max items-center justify-between px-gutter py-sm">
        <button
          type="button"
          onClick={() => onNavigate?.("home")}
          className="text-headline-md font-display-lg text-primary transition-opacity hover:opacity-90 dark:text-inverse-primary"
        >
          Trust Circles
        </button>
        <div className="hidden md:flex items-center gap-md">
          {navItems.map((item) => {
            const active = currentView === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate?.(item.key)}
                className={`rounded-full px-3 py-1 transition-colors duration-200 ease-in-out ${
                  active
                    ? "font-bold text-primary dark:text-inverse-primary"
                    : "text-on-surface-variant hover:bg-surface-variant/20 hover:text-primary dark:text-surface-variant dark:hover:bg-surface-variant/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-sm">
          {walletAddress && (
            <span className="hidden sm:inline-flex rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 font-data-code text-[11px] text-on-surface-variant">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </span>
          )}
          <button
            type="button"
            onClick={onConnectWallet}
            className="flex items-center gap-2 rounded-full bg-primary px-sm py-xs font-label-caps text-label-caps text-on-primary transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            {walletAddress ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
