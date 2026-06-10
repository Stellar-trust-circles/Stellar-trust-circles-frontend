# Trust Circles — Frontend

React web interface for the Stellar Trust Circles platform — a decentralized rotating savings group protocol built on Stellar.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-7C3AED)](https://stellar.org)

---

## What this is

A browser-based interface that lets users create and participate in Trust Circles. It connects to the deployed Soroban smart contract on Stellar using the Stellar JS SDK and the Freighter browser wallet.

---

## Features

- Connect your Stellar wallet via Freighter
- Create a new savings circle with custom members and settings
- View your active circles and their current cycle status
- Contribute USDC to a circle with one click
- View each member's on-chain reputation score
- Admin: release payouts to the next member in rotation

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

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_CONTRACT_ID=CANM5X47IG3AM5JDG6DVGZ24B3RLBNT5653CXRUEUDWF6JERO4YEX6ZS
VITE_STELLAR_NETWORK=testnet
VITE_RPC_URL=https://soroban-testnet.stellar.org
```

---

## Project structure

```
src/
├── pages/
│   ├── Home.jsx              # List of user's circles
│   ├── CreateCircle.jsx      # Create circle form
│   ├── CircleDetail.jsx      # Circle status + actions
│   └── Profile.jsx           # Reputation and history
├── components/
│   ├── Navbar.jsx            # Wallet connect + nav
│   ├── CircleCard.jsx        # Circle summary card
│   ├── MemberList.jsx        # Member table with rep scores
│   ├── ContributeButton.jsx  # One-click contribute
│   └── ReputationBadge.jsx   # Visual rep score badge
├── hooks/
│   └── useStellar.js         # All contract interactions
├── lib/
│   └── stellar.js            # Raw Stellar SDK wrapper
└── main.jsx
```

---

## Related repositories

| Repo | Description |
|------|-------------|
| [contracts](https://github.com/Stellar-trust-circles/contracts) | Soroban smart contracts |
| [documents](https://github.com/Stellar-trust-circles/documents) | Documentation and guides |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up locally and pick up an open issue.

---

## License

MIT