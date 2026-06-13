import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStellar } from "../hooks/useStellar";
import { useWallet } from "../hooks/useWallet";
import MemberList from "../components/MemberList";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "12px 14px",
    }}>
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
    </div>
  );
}

export default function CircleDetail() {
  const { id: contractId } = useParams<{ id: string }>();
  const { address } = useWallet();
  const { loading, error, circleStatus, fetchStatus, handleContribute, handleReleasePayout } =
    useStellar(contractId);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (contractId) {
      void fetchStatus();
    }
  }, [fetchStatus, contractId]);

  useEffect(() => {
    if (!circleStatus?.cycleDeadline) return;
    const tick = () => {
      const diff = new Date(circleStatus.cycleDeadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Deadline passed"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [circleStatus]);

  if (loading && !circleStatus) {
    return <p style={{ padding: 32, color: "#6b7280" }}>Loading circle...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 32, color: "#dc2626" }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!circleStatus) {
    return (
      <div style={{ padding: 32, color: "#6b7280" }}>
        No circle found for ID: {contractId}
      </div>
    );
  }

  const nextRecipient = circleStatus.members[circleStatus.payoutIndex];

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 4 }}>
            {circleStatus.name}
          </h1>
          <span style={{
            fontSize: 12,
            background: circleStatus.isActive ? "#dcfce7" : "#f3f4f6",
            color: circleStatus.isActive ? "#166534" : "#6b7280",
            padding: "2px 10px",
            borderRadius: 20,
          }}>
            {circleStatus.isActive ? "Active" : "Completed"}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Cycle</div>
          <div style={{ fontWeight: 600, fontSize: 20 }}>{circleStatus.currentCycle}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        <StatCard label="Contribution" value={`${circleStatus.contributionUsdc} USDC`} />
        <StatCard label="Members" value={circleStatus.members.length} />
        <StatCard label="Deadline" value={timeLeft || "—"} />
      </div>

      <div style={{
        background: "#faf5ff",
        border: "1px solid #e9d5ff",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, color: "#7c3aed", marginBottom: 4 }}>
          Next payout recipient
        </div>
        <code style={{ fontSize: 13, wordBreak: "break-all" }}>
          {nextRecipient}
        </code>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => void handleContribute()}
          disabled={loading || !address}
          style={primaryBtn}
        >
          {loading ? "Processing..." : "Contribute"}
        </button>
        <button
          onClick={() => void handleReleasePayout()}
          disabled={loading || !address}
          style={secondaryBtn}
        >
          Release payout
        </button>
      </div>

      <h2 style={{ fontWeight: 500, fontSize: 16, marginBottom: 12 }}>Members</h2>
      <MemberList
        contractId={contractId || ""}
        members={circleStatus.members}
        payoutIndex={circleStatus.payoutIndex}
      />
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  background: "#7C3AED",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  flex: 1,
};

const secondaryBtn: React.CSSProperties = {
  background: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "10px 20px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  flex: 1,
};
