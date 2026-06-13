import { useState } from "react";
import { createCircle } from "../lib/stellar";
import { useWallet } from "../hooks/useWallet";
import type { CreateCircleParams } from "../lib/types";

const CYCLE_OPTIONS = [
  { label: "Weekly",   value: 604800   },
  { label: "Bi-weekly", value: 1209600 },
  { label: "Monthly",  value: 2592000  },
];

type Status = "idle" | "loading" | "success" | "error";

export default function CreateCircle() {
  const { address, connect } = useWallet();

  const [form, setForm] = useState({
    name: "",
    members: "",
    amount: "",
    cycle: 604800,
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!address) { await connect(); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      const memberList = form.members
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      if (!form.name) throw new Error("Circle name is required");
      if (memberList.length < 2)
        throw new Error("Need at least 2 member addresses");
      if (!form.amount || isNaN(Number(form.amount)))
        throw new Error("Enter a valid contribution amount");

      const params: CreateCircleParams = {
        name: form.name,
        memberAddresses: memberList,
        contributionUsdc: parseFloat(form.amount),
        cycleLengthSecs: Number(form.cycle),
      };

      await createCircle(params, address);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", padding: "0 16px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Circle created</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
          Your circle is live on Stellar Testnet
        </p>
        <a href="/" style={primaryLinkStyle}>View my circles</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 4 }}>
        Create a circle
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
        Set up a new rotating savings group on Stellar
      </p>

      <label style={labelStyle}>Circle name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. Lagos Squad"
        style={inputStyle}
      />

      <label style={labelStyle}>Member addresses</label>
      <textarea
        name="members"
        value={form.members}
        onChange={handleChange}
        placeholder="Paste Stellar addresses separated by commas"
        rows={4}
        style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: -12, marginBottom: 16 }}>
        Minimum 2 addresses. Include your own.
      </p>

      <label style={labelStyle}>Contribution amount (USDC)</label>
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="e.g. 10"
        type="number"
        min="1"
        style={inputStyle}
      />

      <label style={labelStyle}>Cycle length</label>
      <select name="cycle" value={form.cycle} onChange={handleChange} style={inputStyle}>
        {CYCLE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {status === "error" && (
        <div style={errorBoxStyle}>{errorMsg}</div>
      )}

      <button
        onClick={() => void handleSubmit()}
        disabled={status === "loading"}
        style={{ ...primaryBtnStyle, width: "100%", marginTop: 8 }}
      >
        {status === "loading"
          ? "Creating..."
          : address
          ? "Create circle"
          : "Connect wallet to continue"}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  marginBottom: 20,
  boxSizing: "border-box",
  outline: "none",
};

const errorBoxStyle: React.CSSProperties = {
  background: "#fef2f2",
  color: "#dc2626",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 16,
};

const primaryBtnStyle: React.CSSProperties = {
  background: "#7C3AED",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
};

const primaryLinkStyle: React.CSSProperties = {
  background: "#7C3AED",
  color: "white",
  padding: "10px 24px",
  borderRadius: 8,
  textDecoration: "none",
  fontSize: 14,
};
