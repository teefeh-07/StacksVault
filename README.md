# 🏦 StacksVault — Decentralized Micro-Savings Platform

<div align="center">

![StacksVault](public/logo.svg)

**Save Smarter. Save On-Chain. Secured by Bitcoin.**

A decentralized micro-savings & goals platform built on [Stacks](https://www.stacks.co/) — Bitcoin's Layer 2 for smart contracts.

[![Built on Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPjwvc3ZnPg==)](https://www.stacks.co/)
[![Clarity](https://img.shields.io/badge/Smart%20Contracts-Clarity-FF5500?style=for-the-badge)](https://docs.stacks.co/clarity)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🎯 What is StacksVault?

StacksVault is a **DeFi micro-savings platform** that lets users create personal savings vaults with target goals and deadlines, all secured on the Stacks blockchain (Bitcoin L2).

### Key Features

- 🏗️ **Create Savings Vaults** — Set a savings goal name, target amount (in STX), and a deadline
- 💰 **Deposit STX** — Make deposits toward your goal at any time
- 📊 **Track Progress** — Real-time on-chain progress tracking with visual indicators
- ✅ **Withdraw on Completion** — Withdraw your funds once the goal is reached
- 🚨 **Emergency Withdrawal** — Safely withdraw after deadline if goal isn't met
- 🔒 **Non-Custodial** — Your funds are controlled by smart contracts, not intermediaries
- 📈 **Platform Analytics** — Live dashboard showing total vaults, STX locked, and more

### Why StacksVault?

| Gap in Stacks Ecosystem | How StacksVault Fills It |
|---|---|
| No personal savings DeFi tools | First dedicated savings vault platform |
| Complex DeFi is intimidating | Simple, goal-oriented UX |
| Users hold STX without purpose | Encourages intentional saving behavior |
| Lack of financial planning tools | Built-in goals, deadlines, and tracking |

---

## 🏗️ Architecture

```
stacks-builder-project/
├── contracts/
│   └── stacks-vault.clar          # Clarity smart contract
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with SEO metadata
│   │   ├── page.tsx               # Main page (composes all sections)
│   │   └── globals.css            # Global styles & dark theme
│   ├── components/
│   │   ├── Navbar.tsx             # Nav bar with wallet connection
│   │   ├── Hero.tsx               # Landing hero section
│   │   ├── StatsPanel.tsx         # Platform analytics dashboard
│   │   ├── CreateVault.tsx        # Create vault form/modal
│   │   ├── VaultList.tsx          # User's vaults with actions
│   │   └── Footer.tsx             # Footer with resources
│   ├── context/
│   │   └── WalletContext.tsx      # Wallet connection state management
│   ├── hooks/
│   │   └── useStacksVault.ts     # Contract interaction hook
│   └── lib/
│       └── constants.ts           # Config, helpers, formatting
├── tests/
│   └── stacks-vault.test.ts       # Contract test scripts
├── .env.example                   # Environment variable template
├── .env.local                     # Local environment variables
├── next.config.ts                 # Next.js configuration
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Leather Wallet** or **Xverse Wallet** browser extension
- **Clarinet** (for smart contract development) — [Install Guide](https://docs.hiro.so/clarinet/getting-started)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/stacks-vault.git
cd stacks-vault
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your contract address after deployment
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contract: `stacks-vault.clar`

### Key Functions

| Function | Type | Description |
|---|---|---|
| `create-vault` | Public | Create a new savings vault with name, target, and deadline |
| `deposit` | Public | Deposit STX into a specific vault |
| `withdraw` | Public | Withdraw funds from a completed vault |
| `emergency-withdraw` | Public | Emergency withdrawal after deadline passes |
| `get-vault` | Read-only | Get vault details by owner and ID |
| `get-platform-stats` | Read-only | Get total platform statistics |
| `get-vault-progress` | Read-only | Get vault progress percentage (0-100) |
| `get-user-vault-count` | Read-only | Get number of vaults for a user |

### Error Codes

| Code | Meaning |
|---|---|
| `u100` | Not authorized |
| `u101` | Vault already exists |
| `u102` | Vault not found |
| `u103` | Invalid amount |
| `u104` | Deadline passed |
| `u105` | Goal not reached |
| `u106` | Vault locked (deadline not reached for emergency withdraw) |
| `u107` | Already withdrawn |
| `u108` | Invalid deadline |
| `u109` | Zero deposit (below minimum) |
| `u110` | Vault limit reached (max 10 per user) |

---

## 🔧 Smart Contract Deployment

### Deploy to Testnet

1. **Install Clarinet:**
   ```bash
   # macOS
   brew install clarinet
   
   # Windows
   winget install HiroSystems.Clarinet
   ```

2. **Initialize Clarinet project (if not already):**
   ```bash
   clarinet new stacks-vault-contracts
   cd stacks-vault-contracts
   ```

3. **Copy the contract:**
   ```bash
   cp ../contracts/stacks-vault.clar contracts/
   ```

4. **Test locally:**
   ```bash
   clarinet test
   clarinet console
   ```

5. **Deploy to testnet:**
   ```bash
   clarinet deploy --testnet
   ```

6. **Get testnet STX:**
   Visit [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)

7. **Update `.env.local`** with your deployed contract address.

### Deploy to Mainnet

```bash
clarinet deploy --mainnet
```

> ⚠️ **Important:** Deploying to mainnet requires real STX for transaction fees.

---

## 🌐 Frontend Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `NEXT_PUBLIC_NETWORK` = `mainnet` (or `testnet`)
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = your deployed contract address
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import from Git
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Set environment variables (same as above)
7. Deploy!

---

## ✅ Contest Verification Steps

### For Stacks Builder Rewards Judges:

1. **🌐 Visit the live website** — [YOUR_DEPLOYED_URL]
2. **🦊 Connect wallet** — Click "Connect Wallet" (supports Leather & Xverse)
3. **🏗️ Create a vault** — Fill in a savings goal name, target, and deadline
4. **💰 Make a deposit** — Deposit STX into your vault
5. **📊 Check analytics** — View platform-wide statistics on the dashboard
6. **🔗 Verify on-chain** — All transactions are verifiable on [Stacks Explorer](https://explorer.stacks.co)
7. **📝 Review smart contract** — `contracts/stacks-vault.clar` is fully commented

### What Makes This Project Stand Out:

- ✅ **Real utility** — Solves the problem of undirected STX holding
- ✅ **Clean, modern UI** — Professional design with animations and dark mode
- ✅ **Full smart contract** — Complete Clarity contract with error handling
- ✅ **Wallet integration** — Supports Leather and Xverse wallets
- ✅ **On-chain analytics** — Real-time platform statistics
- ✅ **Non-custodial** — Users always control their funds
- ✅ **Well documented** — Comprehensive README with deployment instructions

---

## 🧪 Testing

### Run Contract Tests

```bash
# In your Clarinet project directory
clarinet test
```

### Test in Clarinet Console

```bash
clarinet console
```

```clarity
;; Create a vault
(contract-call? .stacks-vault create-vault "My Savings" u100000000 u200000)

;; Deposit into vault
(contract-call? .stacks-vault deposit u0 u50000000)

;; Check progress
(contract-call? .stacks-vault get-vault-progress tx-sender u0)

;; Get platform stats
(contract-call? .stacks-vault get-platform-stats)
```

### Frontend Tests

```bash
npm run test
```

---

## 📊 Analytics Dashboard

The built-in analytics dashboard shows real-time on-chain data:

- **Total Vaults** — Number of vaults created across all users
- **STX Locked** — Total STX locked in active vaults
- **Goals Completed** — Number of successfully completed savings goals
- **Total Users** — Unique users who have created vaults

Data refreshes automatically every 30 seconds.

---

## 🛣️ Roadmap

- [ ] **v1.0** — Core savings vaults (current)
- [ ] **v1.1** — NFT achievement badges for completing goals
- [ ] **v1.2** — Social sharing of savings milestones
- [ ] **v1.3** — Group savings vaults (collaborative)
- [ ] **v1.4** — STX stacking integration (earn yield while saving)
- [ ] **v2.0** — Multi-token vault support (SIP-010 tokens)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Stacks](https://www.stacks.co/) — Bitcoin L2 with smart contracts
- [Hiro](https://www.hiro.so/) — Developer tools for Stacks
- [Leather](https://leather.io/) — Bitcoin & Stacks wallet
- [Xverse](https://www.xverse.app/) — Bitcoin wallet with Stacks support

---

<div align="center">
  <strong>Built with ❤️ for the Stacks Builder Rewards Contest — March 2026</strong>
</div>
