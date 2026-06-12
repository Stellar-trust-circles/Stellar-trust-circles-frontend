# Trust Circles — Frontend

React + TypeScript web interface for the Stellar Trust Circles platform — a decentralized rotating savings group protocol built on Stellar.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-7C3AED)](https://stellar.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6)](https://www.typescriptlang.org)

---

## Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript 5.4 | Type safety across all contract interactions |
| Vite 5 | Dev server and bundler |
| Stellar JS SDK | Contract invocation and transaction building |
| Freighter API | Browser wallet connection and transaction signing |

---

## Prerequisites

- Node.js 18+
- [Freighter wallet](https://www.freighter.app/) browser extension
- A funded Stellar Testnet account

---

## Getting started

```bash
git clone https://github.com/Stellar-trust-circles/frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment variables

```bash
VITE_CONTRACT_ID=CANM5X47IG3AM5JDG6DVGZ24B3RLBNT5653CXRUEUDWF6JERO4YEX6ZS
VITE_STELLAR_NETWORK=testnet
VITE_RPC_URL=https://soroban-testnet.stellar.org
```

---

## Project structure

```
src/
├── types/
│   └── contracts.ts          # TypeScript types mirroring Soroban structs
├── lib/
│   └── stellar.ts            # All contract calls + Freighter signing
├── hooks/
│   ├── useStellar.ts         # Circle state and contract action hooks
│   └── useWallet.ts          # Freighter wallet connection hook
├── components/
│   ├── Navbar.tsx            # Navigation + wallet connect
│   ├── MemberList.tsx        # Member table with reputation scores
│   └── ReputationBadge.tsx   # Visual reputation tier badge
├── pages/
│   ├── CircleDetail.tsx      # Circle status, contribute, payout
│   └── CreateCircle.tsx      # Create circle form
├── main.tsx                  # App entry point and routing
└── vite-env.d.ts             # Vite environment type declarations
```

---

## Available scripts

```bash
npm run dev        # Start dev server at localhost:5173
npm run build      # Type-check and build for production
npm run typecheck  # Run tsc without emitting — catch type errors
npm run lint       # Run ESLint on all .ts and .tsx files
npm run preview    # Preview the production build locally
```

---

## TypeScript notes

All contract interactions are fully typed. The `src/types/contracts.ts` file mirrors every Soroban struct and enum so TypeScript catches mismatches between the frontend and contract at compile time.

The `src/lib/stellar.ts` file uses the Stellar JS SDK to build and submit transactions. Wallet signing is handled entirely by the Freighter browser extension — no private keys are ever handled in the app.

---

## Related repositories

| Repo | Description |
|------|-------------|
| [contracts](https://github.com/Stellar-trust-circles/contracts) | Soroban smart contracts (Rust) |
| [documents](https://github.com/Stellar-trust-circles/documents) | Integration guide, user guide, architecture |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) to get set up locally and pick up an open issue.

Issues tagged [`good first issue`](../../issues?q=label%3A%22good+first+issue%22) are a great place to start.

---

## License

MIT