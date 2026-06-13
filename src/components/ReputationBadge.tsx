import { getReputationTier } from "../lib/types";
import type { ReputationTier } from "../lib/types";

interface ReputationBadgeProps {
  score: number | null;
}

const tierStyles: Record<ReputationTier, { bg: string; color: string }> = {
  Trusted:          { bg: "#dcfce7", color: "#166534" },
  "Building trust": { bg: "#fef9c3", color: "#854d0e" },
  "New member":     { bg: "#f3f4f6", color: "#6b7280" },
};

export default function ReputationBadge({ score }: ReputationBadgeProps) {
  if (score === null) {
    return <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading...</span>;
  }

  const tier = getReputationTier(score);
  const { bg, color } = tierStyles[tier];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: 11,
        background: bg,
        color,
        padding: "2px 8px",
        borderRadius: 20,
        fontWeight: 500,
      }}>
        {tier}
      </span>
      <span style={{ fontSize: 12, color: "#6b7280" }}>{score} pts</span>
    </div>
  );
}
