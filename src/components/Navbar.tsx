import { useWallet } from "../hooks/useWallet";

export default function Navbar() {
  const { address, connecting, error, connect, disconnect } = useWallet();

  const short = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 24px",
      borderBottom: "1px solid #e5e7eb",
    }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>✦ Trust Circles</div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <a href="/" style={linkStyle}>Home</a>
        <a href="/create" style={linkStyle}>New Circle</a>

        {error && (
          <span style={{ fontSize: 12, color: "#dc2626" }}>{error}</span>
        )}

        {address ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={addressBadge}>{short}</span>
            <button onClick={disconnect} style={ghostBtn}>
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={connect} disabled={connecting} style={primaryBtn}>
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#374151",
  textDecoration: "none",
};

const addressBadge: React.CSSProperties = {
  fontSize: 13,
  background: "#f3f4f6",
  padding: "6px 12px",
  borderRadius: 20,
  fontFamily: "monospace",
};

const primaryBtn: React.CSSProperties = {
  background: "#7C3AED",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid #d1d5db",
  color: "#374151",
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
};
