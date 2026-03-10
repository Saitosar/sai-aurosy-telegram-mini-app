# V1 Integration Plan

Implementation plan for moving the SAI AUROSY Telegram Mini App from skeleton/mock state to a real V1 integration-ready MVP.

## Integration Gaps Summary

| Area | Current State | Target State |
|------|---------------|--------------|
| **Auth** | Mock tokens, no initData validation | Forward initData to platform; platform validates HMAC and returns tokens |
| **Backend** | Controller-only, in-memory mock data | Platform client service + proxy; mock fallback when platform unavailable |
| **Frontend** | Local mock data, API client unused | Fetch from backend via API; real data flows |
| **Telemetry** | Mock polling only | Polling + SSE/WebSocket-ready transport abstraction |
| **Auth gate** | `useTelegramAuth` exists but unused | App-level auth bootstrap; protected routes optional for V1 |
| **Robot commands** | No backend endpoint | Add `POST /robots/:id/commands`; proxy to platform |
| **Safe stop** | Not implemented | "Stop" button = robot command `safe_stop` or `stop`; platform defines exact type |

## Assumptions and Platform API Expectations

- **Platform API paths:** Assumed to match gateway paths: `/auth/login`, `/robots`, `/store/items`, `/scenarios`, `/telemetry/:robotId`. If platform uses version prefix (e.g. `/v1/`), add `PLATFORM_API_PATH_PREFIX` env var.
- **Platform auth:** Platform exposes `POST /auth/login` accepting `{ initData }` and returns `{ sessionToken, refreshToken?, expiresAt? }`. Platform validates initData HMAC with bot token.
- **Platform auth fallback:** When `PLATFORM_API_URL` is not set, use mock auth (current behavior) for local dev.
- **Robot commands:** Platform exposes `POST /robots/:id/commands` with `{ command, params? }`. Command types: `stop`, `safe_stop`, `go_home`, etc. (TBD by platform).
- **Telemetry stream:** Platform may expose `GET /telemetry/:robotId/stream` (SSE) or WebSocket. V1 implements polling; transport abstraction ready for SSE/WS when available.
- **Store:** In V1 scope; proxy to platform. If platform store not ready, mock fallback.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PLATFORM_API_URL` | Platform API base URL (e.g. `https://platform.example.com`). When set, gateway proxies requests to platform. When unset, mock data is used. |
| `TELEGRAM_BOT_TOKEN` | Bot token for Telegram initData HMAC validation. Used by platform when validating initData; gateway does not validate locally (platform does). Documented for reference. |

## Platform Path Mapping

Gateway forwards requests to platform using the same path structure:

| Gateway Path | Platform Path | Method |
|--------------|---------------|--------|
| `/auth/login` | `{PLATFORM_API_URL}/auth/login` | POST |
| `/auth/logout` | `{PLATFORM_API_URL}/auth/logout` | POST |
| `/robots` | `{PLATFORM_API_URL}/robots` | GET |
| `/robots/:id` | `{PLATFORM_API_URL}/robots/:id` | GET |
| `/robots/:id/commands` | `{PLATFORM_API_URL}/robots/:id/commands` | POST |
| `/store/items` | `{PLATFORM_API_URL}/store/items` | GET |
| `/store/items/:id` | `{PLATFORM_API_URL}/store/items/:id` | GET |
| `/store/items/:id/acquire` | `{PLATFORM_API_URL}/store/items/:id/acquire` | POST |
| `/scenarios` | `{PLATFORM_API_URL}/scenarios` | GET |
| `/scenarios/:id` | `{PLATFORM_API_URL}/scenarios/:id` | GET |
| `/scenarios/:id/run` | `{PLATFORM_API_URL}/scenarios/:id/run` | POST |
| `/scenarios/:id/executions/:executionId` | `{PLATFORM_API_URL}/scenarios/:id/executions/:executionId` | GET |
| `/scenarios/:id/executions/:executionId/stop` | `{PLATFORM_API_URL}/scenarios/:id/executions/:executionId/stop` | POST |
| `/telemetry/:robotId` | `{PLATFORM_API_URL}/telemetry/:robotId` | GET |
| `/telemetry/:robotId/stream` | `{PLATFORM_API_URL}/telemetry/:robotId/stream` | GET (SSE, when available) |

## Mock Fallback Behavior

When `PLATFORM_API_URL` is **not** set:

- **Auth:** Returns mock tokens (`mock-session-{timestamp}`, `mock-refresh-{timestamp}`).
- **Robots:** Returns in-memory `MOCK_ROBOTS` and `MOCK_ROBOT_DETAILS`.
- **Robots commands:** Returns 200 OK (no-op).
- **Store:** Returns in-memory `MOCK_ITEMS`; acquire returns `{ success: true }`.
- **Scenarios:** Returns in-memory `MOCK_SCENARIOS`; run/stop use in-memory executions Map.
- **Telemetry:** Returns in-memory `MOCK_TELEMETRY` per robot.

When `PLATFORM_API_URL` **is** set:

- All requests are proxied to platform.
- Platform responses (including 4xx/5xx) are passed through to the client.
- If platform is unreachable, gateway returns 502 Bad Gateway.

## Pending Integration Points

- Platform API documentation (OpenAPI/Swagger) for exact request/response schemas.
- Platform support for `POST /auth/login` with `initData`.
- Platform support for `POST /robots/:id/commands` with command types.
- Platform support for `GET /telemetry/:robotId/stream` (SSE) for real-time telemetry.
