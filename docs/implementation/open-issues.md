# Open Issues (V1)

Items pending platform support, documentation, or future implementation.

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
- **Detail:** SAI AUROSY Marketplace is Phase 3.4. No store API in current platform.
- **Current:** In-memory mock items; acquire returns success

## Enhancements

### Idempotency-Key

- **Status:** Platform supports
- **Detail:** SAI AUROSY accepts `Idempotency-Key` header for `POST /api/v1/robots/{id}/command`
- **Action:** Gateway can forward header when client sends it; prevents duplicate commands on retry

### Frontend Route-Level AuthGuard

- **Status:** Deferred for V1
- **Detail:** Backend AuthGuard is priority. Frontend could redirect unauthenticated users when `authenticated === false` and platform is required.
- **Action:** Document in UX; implement in follow-up if needed
