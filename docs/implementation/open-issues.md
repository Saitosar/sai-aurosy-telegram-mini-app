# Open Issues (V1)

Items pending platform support, documentation, or future implementation.

**Implemented:** The NestJS backend in `backend/` is implemented and acts as the Mini App Gateway. It proxies requests to the platform when `PLATFORM_API_URL` is set, or serves mock data when unset. Robot connect/disconnect endpoints (`POST /robots/connect`, `POST /robots/:id/disconnect`) are not implemented; see [API Overview](../api/api-overview.md).

## Platform Integration

### Platform OpenAPI

- **Status:** TODO
- **Action:** Fetch from `GET /api/openapi.json` when SAI AUROSY Control Plane is running
- **Purpose:** Align shared DTOs with platform schemas; validate request/response shapes

### Telemetry Poll

- **Status:** Platform has SSE only
- **Detail:** SAI AUROSY exposes `GET /api/v1/telemetry/stream?robot_id=x` (SSE). No poll endpoint.
- **Options:**
  - (a) Platform adds `GET /api/v1/telemetry/{robotId}` poll endpoint
  - (b) Mini App uses SSE when available; implement `createSSETransport()` to consume stream
  - (c) Mock telemetry for demo when platform is set
- **Current:** Polling uses mock or gateway mock; SSE stub remains

### Telegram Auth

- **Status:** Platform uses JWT/API Key
- **Detail:** SAI AUROSY supports `X-API-Key` and `Authorization: Bearer` (JWT). Telegram `initData` validation requires either:
  - Platform support for `POST /auth/login` with `initData` (HMAC validation)
  - Gateway-side HMAC validation and JWT issuance (gateway would need `TELEGRAM_BOT_TOKEN`)
- **Current:** Mock auth when platform not set; forward initData when platform set (platform must support)

### Token Refresh

- **Status:** TBD
- **Detail:** Platform OAuth supports refresh flow. JWT refresh TBD.
- **Action:** Implement when platform documents refresh endpoint

## Features

### Custom Command

- **Status:** Disabled
- **Detail:** Control Panel "Custom Command" button disabled until platform supports arbitrary commands
- **Platform:** `POST /api/v1/robots/{id}/command` accepts command type; custom commands TBD

### Store / Marketplace

- **Status:** Mock only in V1
- **Detail:** SAI AUROSY Marketplace is Phase 3.4. Platform Store API is not implemented.
- **Current:** Store is always mock; backend serves in-memory `MOCK_ITEMS`; acquire returns `{ success: true }`; no proxying to platform

## Enhancements

### Idempotency-Key

- **Status:** Platform supports
- **Detail:** SAI AUROSY accepts `Idempotency-Key` header for `POST /api/v1/robots/{id}/command`
- **Action:** Gateway can forward header when client sends it; prevents duplicate commands on retry

### Frontend Route-Level AuthGuard

- **Status:** Deferred for V1
- **Detail:** Backend AuthGuard is priority. Frontend could redirect unauthenticated users when `authenticated === false` and platform is required.
- **Action:** Document in UX; implement in follow-up if needed
