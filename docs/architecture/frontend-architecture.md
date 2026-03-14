# Frontend Architecture

## Frontend Responsibility Boundary

The Mini App frontend is an **external client**. It owns only presentation and API communication.

### In Scope

| Responsibility | Description |
|----------------|-------------|
| **UI** | Render screens, handle user input, display data from platform |
| **Routing** | Navigate between screens; manage in-app navigation stack |
| **API client** | Send HTTP requests to NestJS backend (`VITE_API_BASE_URL`); handle responses |
| **Session storage** | Store session tokens; clear on logout |
| **Telegram SDK integration** | Read init data, apply theme, handle viewport, Back Button |

### Out of Scope

| Exclusion | Reason |
|-----------|--------|
| Business logic | Platform owns validation, pricing, eligibility |
| Robot control | Platform mediates all robot communication |
| Data persistence | Platform is source of truth; no local business data |
| Auth validation | Platform validates initData; app only forwards it |

See [Screen Map](../ux/screen-map.md) for navigation structure and screen transitions.

## Technology Stack

- **Framework** — React 19 + Vite
- **3D** — Three.js, [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei) (Event Mode Demo)
- **Telegram** — [Telegram Web App SDK](https://core.telegram.org/bots/webapps)
- **HTTP client** — Fetch for NestJS backend API
- **State** — React state, Context
- **Routing** — React Router

## Structure

```
src/
├── main.tsx              # Entry point; mounts App
├── App.tsx               # TonConnectUIProvider, ThemeProvider, LocaleProvider, TelegramProvider, RouterProvider
├── routes.tsx            # React Router config
├── components/           # Reusable UI components
│   ├── layout/           # AppLayout, TelegramProvider
│   ├── ui/               # Skeleton, utils.ts (cn)
│   └── wallet/           # TonWalletSection, MockActions
├── screens/              # Screen-level components
│   ├── dashboard/
│   ├── robots/
│   ├── store/
│   ├── control/
│   ├── scripts/
│   ├── mall-guide/       # MallGuideLayout, MallGuideScreen, MallGuideCalibrationScreen
│   ├── wallet/
│   ├── settings/
│   └── demo/             # Event Mode Demo
├── api/                  # API client, endpoints (auth, robots, store, scenarios, telemetry)
├── auth/                 # useTelegramAuth, session
├── contexts/             # ThemeContext, LocaleContext
├── hooks/                # useTelemetry, useDemo, useRobotPath
├── utils/                # telegram.ts (getTelegramUser, getInitData, isInTelegram)
└── styles/               # theme.css, fonts.css
```

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Dashboard (Home) | `/` | Entry point; tab label "Home"; quick links to robots, store, Scripts |
| Robots | `/robots` | List and manage connected robots |
| Store | `/store` | Browse and acquire robots |
| TON Wallet | `/wallet` | Connect TON wallet, view address, mock actions |
| Settings | `/settings` | App settings menu: User Profile, Theme toggle, Language selector |
| User Profile | `/settings/profile` | View Telegram user data when authenticated; login prompt when not |
| Control Panel | `/control/:robotId` | View robot data and send commands |
| Scripts | `/scripts` | Browse scripts by type |
| Mall Guide | `/scripts/mall-guide` | Run Mall Guide script |
| Mall Guide Calibration | `/scripts/mall-guide/calibration` | Calibrate mall floor plan (reception, stores, routes) |
| Event Mode Demo | `/demo` | 3D robot demo on map overlay (standalone, outside AppLayout) |

## API Client

- **Base URL** — `VITE_API_BASE_URL` points to the NestJS backend (e.g. `http://localhost:3001`)
- **Auth header injection** — Attach `Authorization: Bearer <token>` to all authenticated requests
- **Endpoint modules** — `auth`, `robots`, `store`, `scenarios`, `telemetry`
- **Error handling** — Map status codes to user-facing messages
- **No business logic** — Only request/response handling; no validation or computation

### API Client Flow

```
User action → API client → NestJS backend (VITE_API_BASE_URL) → HTTP request with auth header
Response → API client → Parse → Update UI state
```

The client always uses the NestJS backend as the API base. The backend proxies to the platform when `PLATFORM_API_URL` is set, or serves mock data when unset.

## State Management

- **Server state** — Fetched from NestJS backend (which proxies to platform or serves mock); cached with simple invalidation (e.g., on navigation or manual refresh)
- **Local state** — UI state (modals, loading, selected robot); no persistence of business data
- **Session** — Token and user info; stored in memory or sessionStorage; cleared on logout

## Telegram Mini App Specifics

### Init Data

- `window.Telegram.WebApp.initData` — Contains user and auth hash
- Pass to NestJS backend (`POST /auth/login`); backend forwards to platform for validation; do not trust client-side parsing for security

### Theme

- `window.Telegram.WebApp.themeParams` — Colors for header, background, text
- Apply to app theme for consistent look with Telegram
- **Theme toggle (mock)** — Settings screen has Light/Dark toggle; preference stored in localStorage; may be overridden by Telegram themeParams in production
- **Locale selector (mock)** — Settings screen has language dropdown (en, uz, az, ar-AE, tr, ru); selection persisted for future i18n; app text does not change yet

### Viewport

- `window.Telegram.WebApp.expand()` — Expand to full height when appropriate
- `window.Telegram.WebApp.ready()` — Signal that app is ready
- Handle viewport changes for mobile keyboards and orientation

### Back Button

- `window.Telegram.WebApp.BackButton` — Show/hide based on navigation stack

## No Backend Logic in Frontend

The frontend must not:

- Validate business rules (e.g., acquisition eligibility)
- Compute prices or apply discounts
- Decide robot connectivity or command execution
- Store sensitive data beyond session tokens

All such logic lives in the SAI AUROSY platform.
