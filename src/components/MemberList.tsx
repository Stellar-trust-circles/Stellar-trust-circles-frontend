import { useEffect, useState } from "react";
import ReputationBadge from "./ReputationBadge";
import { getReputation } from "../lib/stellar";

interface MemberListProps {
  contractId: string;
  members: string[];
  payoutIndex: number;
}

export default function MemberList({ contractId, members, payoutIndex }: MemberListProps) {
  const [reps, setReps] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadReps() {
      const results: Record<string, number> = {};
      for (const address of members) {
        try {
          results[address] = await getReputation(contractId, address);
        } catch {
          results[address] = 0;
        }
      }
      setReps(results);
    }
    if (members.length > 0 && contractId) void loadReps();
  }, [members, contractId]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      {members.map((address, i) => (
        <div
          key={address}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: i < members.length - 1 ? "1px solid #f3f4f6" : "none",
            background: i === payoutIndex ? "#faf5ff" : "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "#7C3AED",
            }}>
              {i + 1}
            </div>
            <code style={{ fontSize: 12, color: "#374151" }}>
              {address.slice(0, 8)}...{address.slice(-6)}
            </code>
            {i === payoutIndex && (
              <span style={{
                fontSize: 11,
                background: "#ede9fe",
                color: "#7C3AED",
                padding: "2px 8px",
                borderRadius: 20,
              }}>
                Next payout
              </span>
            )}
          </div>
          <ReputationBadge score={reps[address] ?? null} />
        </div>
      ))}
    </div>
  );
}
