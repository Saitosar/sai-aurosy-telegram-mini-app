# API Overview

## Introduction

The SAI AUROSY Telegram Mini App calls the **NestJS backend** at `VITE_API_BASE_URL`. The backend implements these endpoints and either proxies to the SAI AUROSY platform (when `PLATFORM_API_URL` is set) or serves mock data when unset. This document describes the API domains, endpoints, and patterns. Exact request/response schemas are defined in the shared DTOs and platform API documentation (TBD).

**Path mapping:** When proxying to the platform, the backend maps paths where they differ. For example, the app uses `POST /robots/:id/commands` while the platform uses `POST /robots/:id/command` (singular); the backend translates between them.

## API Domains

| Domain | Purpose |
|--------|---------|
| **Auth** | Login, refresh, logout |
| **Robots** | List, get, connect, disconnect, commands |
| **Store** | List items, acquire |
| **Scenarios** | List, get, run, status |
| **Telemetry** | Robot status and telemetry |

## Auth

| Operation | Method | Purpose |
|-----------|--------|---------|
| Login | `POST /auth/login` | Send Telegram init data; receive session token |
| Refresh | `POST /auth/refresh` | Exchange refresh token for new session token (Planned, TBD) |
| Logout | `POST /auth/logout` | Invalidate session |

**Login request:** `{ "initData": "<Telegram WebApp initData string>" }`

**Login response:** `{ "sessionToken": "...", "refreshToken": "...", "expiresAt": "..." }` (TBD)

## Robots

| Operation | Method | Purpose |
|-----------|--------|---------|
| List | `GET /robots` | List user's robots |
| Get | `GET /robots/:id` | Get robot details |
| Connect | `POST /robots/connect` | Link robot to user (Planned, TBD) |
| Disconnect | `POST /robots/:id/disconnect` | Unlink robot (Planned, TBD) |
| Send command | `POST /robots/:id/commands` | Send command to robot |

**Command request:** `{ "command": "<commandType>", "params": { ... } }` (TBD)

## Store

| Operation | Method | Purpose |
|-----------|--------|---------|
| List items | `GET /store/items` | Browse catalog |
| Get item | `GET /store/items/:id` | Item details |
| Acquire | `POST /store/items/:id/acquire` | Acquire item (add to user's fleet) |

## Scenarios

| Operation | Method | Purpose |
|-----------|--------|---------|
| List | `GET /scenarios` | List available scenarios |
| Get | `GET /scenarios/:id` | Scenario details |
| Run | `POST /scenarios/:id/run` | Start scenario on robot `{ "robotId": "..." }` |
| Status | `GET /scenarios/:id/executions/:executionId` | Execution status |
| Stop | `POST /scenarios/:id/executions/:executionId/stop` | Stop execution |

## Telemetry

| Operation | Method | Purpose |
|-----------|--------|---------|
| Subscribe/Stream | `GET /telemetry/:robotId/stream` | Real-time robot status (SSE; returns 501 when platform stream not available) |
| Poll | `GET /telemetry/:robotId` | Current robot status (polling) |

**Response:** Robot status, position, sensor data (schema TBD)

## Request/Response Patterns

### Authentication Header

All authenticated requests include:

```
Authorization: Bearer <sessionToken>
```

### Content Type

- Request: `Content-Type: application/json`
- Response: `application/json`

### Pagination (TBD)

List endpoints may support:

- `?page=1&limit=20`
- Or cursor-based: `?cursor=...&limit=20`

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Error Codes

| HTTP Status | Typical Cause |
|-------------|---------------|
| 400 | Bad request (invalid params) |
| 401 | Unauthorized (expired/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not found |
| 409 | Conflict (e.g., robot already connected) |
| 5xx | Server error |

## Platform API Documentation

Full API documentation (OpenAPI/Swagger, base URLs, schemas) is maintained by the SAI AUROSY platform team. Reference that documentation for implementation details. The NestJS backend in `backend/` implements the API surface described above; when `PLATFORM_API_URL` is set, it proxies requests to the platform.
