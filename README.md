# SAI AUROSY Telegram Mini App

A lightweight mobile control interface for robot operations through Telegram.

## What It Is

The SAI AUROSY Telegram Mini App is a **client interface** for the SAI AUROSY robotics platform. It runs inside Telegram as a Mini App and connects to the platform via APIs. It does not contain core robot control logic and does not connect directly to robots.

## Key Capabilities (V1)

- **Robot Connection** — View and manage robots connected to your platform account
- **Mall Guide Scenario** — Launch and monitor the Mall Guide scenario on selected robots
- **Robot Store** — Browse and acquire robots from the platform store
- **Control Panel** — View robot data and send commands

## Architecture

- **External client** — Mini App runs inside Telegram; optional Gateway may proxy requests
- **Platform as backend** — All business logic lives in the SAI AUROSY platform
- **API integration** — Communicates via platform REST/GraphQL APIs (direct or via Gateway)
- **Telegram authentication** — Uses Telegram Web App init data; platform validates and issues sessions

## Documentation

- [Product Overview](docs/product/product-overview.md)
- [System Architecture](docs/architecture/system-architecture.md)
- [Integration with SAI Platform](docs/architecture/integration-with-sai-platform.md)
- [Authentication and Security](docs/architecture/auth-and-security.md)

## Prerequisites

- Node.js 18+
- npm (or pnpm)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` — API base URL for the frontend (must match backend port, e.g. `http://localhost:3001`)
- `PORT` — Backend port (default: `3000`; use `3001` if 3000 is occupied)

### 3. Run locally

**Option A: Run both frontend and backend**

```bash
npm run dev
```

**Option B: Run separately**

```bash
# Terminal 1 - Backend (mock API)
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### 4. Access

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000 (or 3001 if `PORT=3001` in `.env`)

### 5. Telegram testing

To test inside Telegram:

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Set the Web App URL to your deployed frontend (or use a tunnel like ngrok for local dev)
3. Open the Mini App from the bot menu

For local development without Telegram, the app runs with mock data and skips auth.

## Project structure

```
├── frontend/     # React + Vite + Tailwind
├── backend/      # NestJS mock API + Gateway placeholder
├── shared/       # Shared DTOs
└── docs/         # Documentation
```

## Build

```bash
npm run build
```

## License

TBD
