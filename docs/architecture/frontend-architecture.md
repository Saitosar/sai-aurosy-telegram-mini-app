# Frontend Architecture

## Frontend Responsibility Boundary

The Mini App frontend is an **external client**. It owns only presentation and API communication.

### In Scope

| Responsibility | Description |
|----------------|-------------|
| **UI** | Render screens, handle user input, display data from platform |
| **Routing** | Navigate between screens; manage in-app navigation stack |
| **API client** | Send HTTP requests to platform (via Gateway or direct); handle responses |
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

## Technology Stack (TBD)

- **Framework** — React, Vue, or similar (TBD)
- **Telegram** — [Telegram Web App SDK](https://core.telegram.org/bots/webapps)
- **HTTP client** — Fetch or axios for platform API
- **State** — Context, Zustand, or similar (TBD)
- **Routing** — React Router or equivalent (TBD)

## Structure

```
src/
├── components/     # Reusable UI components
├── screens/       # Screen-level components (Robots, Store, Control, Mall Guide)
├── api/           # API client, endpoints, types
├── auth/          # Auth module (init data, token storage, refresh)
├── hooks/         # Custom hooks (e.g., useRobots, useSession)
├── utils/         # Helpers
└── App.tsx        # Root, router, theme
```

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Dashboard | `/` | Entry point; quick links to robots, store, Mall Guide |
| Robots | `/robots` | List and manage connected robots |
| Store | `/store` | Browse and acquire robots |
| Control Panel | `/control/:robotId` | View robot data and send commands |
| Mall Guide | `/scenarios/mall-guide` | Run Mall Guide scenario |

## API Client

- **Base URL** — Configured to Gateway URL (when deployed) or Platform API URL (direct)
- **Auth header injection** — Attach `Authorization: Bearer <token>` to all authenticated requests
- **Endpoint modules** — `auth`, `robots`, `store`, `scenarios`, `telemetry`
- **Error handling** — Map status codes to user-facing messages
- **No business logic** — Only request/response handling; no validation or computation

### API Client Flow

```
User action → API client → Base URL (Gateway or Platform) → HTTP request with auth header
Response → API client → Parse → Update UI state
```

The client always uses a single base URL. When the Gateway is used, the base URL points to the Gateway; when not, it points directly to the Platform API.

## State Management

- **Server state** — Fetched from platform; cached with simple invalidation (e.g., on navigation or manual refresh)
- **Local state** — UI state (modals, loading, selected robot); no persistence of business data
- **Session** — Token and user info; stored in memory or sessionStorage; cleared on logout

## Telegram Mini App Specifics

### Init Data

- `window.Telegram.WebApp.initData` — Contains user and auth hash
- Pass to platform for validation; do not trust client-side parsing for security

### Theme

- `window.Telegram.WebApp.themeParams` — Colors for header, background, text
- Apply to app theme for consistent look with Telegram

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
