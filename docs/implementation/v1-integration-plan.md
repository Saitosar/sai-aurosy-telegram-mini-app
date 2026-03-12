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

- **Platform API paths:** Backend prepends `/api/v1` to all platform paths. Platform uses `/api/v1/auth/login`, `/api/v1/robots`, `/api/v1/scenarios`, `/api/v1/telemetry/:robotId`, `POST /api/v1/tasks` (for scenario run). Store is not proxied.
- **Platform auth:** Platform exposes `POST /auth/login` accepting `{ initData }` and returns `{ sessionToken, refreshToken?, expiresAt? }`. Platform validates initData HMAC with bot token.
- **Platform auth fallback:** When `PLATFORM_API_URL` is not set, use mock auth (current behavior) for local dev.
- **Robot commands:** Platform exposes `POST /robots/:id/command` (singular) with `{ command, params? }`. Gateway maps app `POST /robots/:id/commands` to platform. Command types: `stop`, `safe_stop`, `go_home`, etc. (TBD by platform).
- **Telemetry stream:** Platform may expose `GET /telemetry/:robotId/stream` (SSE) or WebSocket. V1 implements polling; transport abstraction ready for SSE/WS when available.
- **Store:** Platform has no Store API (Marketplace Phase 3.4). V1 always uses backend mock; no proxying.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PLATFORM_API_URL` | Platform API base URL (e.g. `https://platform.example.com`). When set, gateway proxies requests to platform. When unset, mock data is used. |
| `TELEGRAM_BOT_TOKEN` | Bot token for Telegram initData HMAC validation. Used by platform when validating initData; gateway does not validate locally (platform does). Documented for reference. |

## Platform Path Mapping

Gateway forwards requests to platform. Backend prepends `/api/v1` to all platform paths. **Store is not proxied** — platform has no Store API; V1 uses backend mock only.

| Gateway Path | Platform Path | Method |
|--------------|---------------|--------|
| `/auth/login` | `{PLATFORM_API_URL}/api/v1/auth/login` | POST |
| `/auth/logout` | `{PLATFORM_API_URL}/api/v1/auth/logout` | POST |
| `/robots` | `{PLATFORM_API_URL}/api/v1/robots` | GET |
| `/robots/:id` | `{PLATFORM_API_URL}/api/v1/robots/:id` | GET |
| `/robots/:id/commands` | `{PLATFORM_API_URL}/api/v1/robots/:id/command` | POST |
| `/scenarios` | `{PLATFORM_API_URL}/api/v1/scenarios` | GET |
| `/scenarios/:id` | `{PLATFORM_API_URL}/api/v1/scenarios/:id` | GET |
| `/scenarios/:id/run` | `{PLATFORM_API_URL}/api/v1/tasks` | POST (body: `robot_id`, `scenario_id`, `payload`) |
| `/scenarios/:id/executions/:executionId` | `{PLATFORM_API_URL}/api/v1/tasks/:executionId` | GET |
| `/scenarios/:id/executions/:executionId/stop` | `{PLATFORM_API_URL}/api/v1/tasks/:executionId/cancel` | POST |
| `/telemetry/:robotId` | `{PLATFORM_API_URL}/api/v1/telemetry/:robotId` | GET |
| `/telemetry/:robotId/stream` | `{PLATFORM_API_URL}/api/v1/telemetry/:robotId/stream` | GET (SSE, when available) |

## Mock Fallback Behavior

When `PLATFORM_API_URL` is **not** set:

- **Auth:** Returns mock tokens (`mock-session-{timestamp}`, `mock-refresh-{timestamp}`).
- **Robots:** Returns in-memory `MOCK_ROBOTS` and `MOCK_ROBOT_DETAILS`.
- **Robots commands:** Returns 200 OK (no-op).
- **Store:** Returns in-memory `MOCK_ITEMS`; acquire returns `{ success: true }`.
- **Scenarios:** Returns in-memory `MOCK_SCENARIOS`; run/stop use in-memory executions Map.
- **Telemetry:** Returns in-memory `MOCK_TELEMETRY` per robot.

When `PLATFORM_API_URL` **is** set:

- Auth, robots, scenarios, and telemetry requests are proxied to platform.
- Platform responses (including 4xx/5xx) are passed through to the client.
- If platform is unreachable, gateway returns 502 Bad Gateway.
- **Store** remains mock (platform has no Store API).

## Pending Integration Points

- Platform API documentation (OpenAPI/Swagger) for exact request/response schemas.
- Platform support for `POST /auth/login` with `initData`.
- Platform support for `POST /robots/:id/commands` with command types.
- Platform support for `GET /telemetry/:robotId/stream` (SSE) for real-time telemetry.
