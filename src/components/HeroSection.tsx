import React, { useState } from "react";

interface HeroSectionProps {
  walletAddress?: string | null;
  onConnectWallet?: () => void;
}

const MEMBER_DOTS = [
  { cx: 200, cy: 40, r: 24, fill: "#6B4FBB", stroke: "none", glow: true },
  { cx: 360, cy: 200, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 200, cy: 360, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 40, cy: 200, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 313, cy: 87, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 313, cy: 313, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 87, cy: 313, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
  { cx: 87, cy: 87, r: 20, fill: "#e8ddff", stroke: "#B9A7E8" },
] as const;

const HeroSection: React.FC<HeroSectionProps> = ({ walletAddress, onConnectWallet }) => {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  return (
    <section className="mb-xl flex flex-col items-center justify-between gap-xl lg:flex-row">
      <div className="w-full space-y-md text-center lg:w-1/2 lg:text-left">
        <h1 className="font-display-lg text-display-lg leading-tight text-on-surface">
          Save together. <br />
          <span className="italic text-primary">Trust the contract</span>, not a person.
        </h1>
        <p className="mx-auto max-w-xl font-body-lg text-body-lg text-on-surface-variant lg:mx-0">
          Join a decentralized community of savers. Automated payouts powered by the Stellar blockchain. No middleman, just collective trust.
        </p>
        <div className="flex flex-col items-center gap-sm pt-sm sm:flex-row lg:justify-start">
          <button
            type="button"
            onClick={onConnectWallet}
            className="w-full rounded-full bg-primary px-xl py-md font-label-caps text-label-caps text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-95 sm:w-auto"
          >
            {walletAddress ? "Wallet Connected" : "Connect Wallet"}
          </button>
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Compatible with</span>
            <span className="font-data-code text-data-code text-primary">Freighter Wallet</span>
          </div>
        </div>
      </div>

      <div className="relative flex w-full justify-center lg:w-1/2">
        <div className="relative flex h-72 w-72 items-center justify-center md:h-[480px] md:w-[480px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low opacity-60" />
          <svg
            className="relative z-10 h-full w-full animate-[spin_60s_linear_infinite]"
            viewBox="0 0 400 400"
            aria-hidden="true"
          >
            <circle
              className="opacity-30"
              cx="200"
              cy="200"
              fill="none"
              r="160"
              stroke="#B9A7E8"
              strokeDasharray="8 8"
              strokeWidth="2"
            />
            <g className="member-dots">
              {MEMBER_DOTS.map((dot, index) => {
                const isHovered = hoveredDot === index;

                return (
                  <circle
                    key={`${dot.cx}-${dot.cy}`}
                    className={"glow" in dot && dot.glow ? "rotation-glow" : undefined}
                    cx={dot.cx}
                    cy={dot.cy}
                    fill={dot.fill}
                    r={isHovered ? dot.r + 4 : dot.r}
                    stroke={dot.stroke}
                    strokeWidth={dot.stroke === "none" ? 0 : 1}
                    onMouseEnter={() => setHoveredDot(index)}
                    onMouseLeave={() => setHoveredDot(null)}
                  />
                );
              })}
            </g>
          </svg>
          <div className="absolute z-20 rounded-2xl border border-surface-variant/30 bg-white/80 p-6 text-center backdrop-blur-md lilac-shadow">
            <p className="mb-1 font-label-caps text-label-caps text-primary">Active Payout</p>
            <p className="font-display-sm text-display-sm">1,250 XLM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
