import React from 'react';

interface MobileNavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const navItems = [
  { key: "home", label: "Home", icon: "home" },
  { key: "circles", label: "Circles", icon: "group" },
  { key: "wallet", label: "Wallet", icon: "account_balance_wallet" },
  { key: "profile", label: "Profile", icon: "person" },
] as const;

const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentView = "home", onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface dark:bg-surface-container-lowest shadow-[0_-4px_20px_rgba(107,79,187,0.08)] flex justify-around items-center px-4 py-3 pb-safe rounded-t-xl">
      {navItems.map((item) => {
        const active = currentView === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate?.(item.key)}
            className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all duration-150 ${
              active
                ? "bg-primary-container text-on-primary-container scale-95"
                : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-[10px] uppercase">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavbar;
