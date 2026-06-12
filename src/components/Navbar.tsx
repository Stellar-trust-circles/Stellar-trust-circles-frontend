// src/components/Navbar.tsx
import { useState } from "react";
import { isConnected, getPublicKey, setAllowed } from "@stellar/freighter-api";

export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  async function connectWallet() {
    setConnecting(true);
    try {
      const connected = await isConnected();
      if (!connected) {
        await setAllowed();
      }
      const publicKey = await getPublicKey();
      setAddress(publicKey);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }

  const short = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 24px",
      borderBottom: "1px solid #e5e7eb"
    }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>
        ✦ Trust Circles
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <a href="/" style={{ fontSize: 14, color: "#374151", textDecoration: "none" }}>Home</a>
        <a href="/create" style={{ fontSize: 14, color: "#374151", textDecoration: "none" }}>New Circle</a>
        {address ? (
          <span style={{
            fontSize: 13,
            background: "#f3f4f6",
            padding: "6px 12px",
            borderRadius: 20,
            fontFamily: "monospace"
          }}>
            {short}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            style={{
              background: "#7C3AED",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}
