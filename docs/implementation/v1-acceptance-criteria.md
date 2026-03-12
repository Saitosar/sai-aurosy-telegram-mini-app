# V1 Acceptance Criteria

Acceptance criteria for the SAI AUROSY Telegram Mini App V1 demo quality release.

## Auth

- [x] **Protected routes:** When `PLATFORM_API_URL` is set, protected routes (robots, store, scenarios, telemetry) return 401 when no valid Bearer token is provided
- [x] **Mock mode:** When `PLATFORM_API_URL` is not set, all routes allow unauthenticated access for demo
- [x] **Auth endpoints:** `POST /auth/login` and `POST /auth/logout` remain public (no AuthGuard)

## DTOs

- [x] **Response conformity:** All API responses conform to shared DTOs (Robot, RobotDetail, Scenario, ScenarioExecution, Telemetry, StoreItem)
- [x] **Mapping layer:** Platform responses pass through mappers that normalize field names and structure (e.g. `robot_id` → `id`)
- [x] **Defensive handling:** Mappers handle missing or unexpected fields with sensible defaults

## Connection and Telemetry

- [x] **Last updated:** Telemetry section in Control Panel shows "Last updated: Xs ago" or equivalent
- [x] **Stale indicator:** When telemetry is older than 10 seconds, show subtle "Data may be outdated" or amber indicator
- [x] **Polling fallback:** Polling transport remains primary when SSE is unavailable

## Control Panel UX

- [x] **Command feedback:** Command success or error is shown (inline message or toast); no silent failures
- [x] **Scenario visibility:** When scenario is stopped, show "Scenario stopped" state; when execution completes, show "Completed"
- [x] **Stop scenario feedback:** Success or error message after Stop Scenario action
- [x] **Custom Command:** Remains disabled with tooltip explaining platform support is pending

## Mall Guide UX

- [x] **Status labels:** Explicit status text: "Running", "Completed", "Stopped", "Error" (not just progress bar)
- [x] **Transition handling:** When status is completed/stopped/error, show final status for 2–3 seconds before clearing or show "Scenario completed" card
- [x] **Error display:** When status is "error", show error state with retry or "Start again" option
- [x] **Idle state:** When no execution, show "Idle" or "Ready to start"

## Audit

- [x] **Command logging:** Backend logs robot commands (robotId, command, timestamp) when commands are sent
- [x] **Scenario logging:** Backend logs scenario run and stop actions (scenarioId, robotId, executionId, timestamp)

## Demo Mode

- [x] **Demo mode:** App works without `PLATFORM_API_URL`; mock data and mock auth
- [x] **Pilot mode:** When `PLATFORM_API_URL` is set, requires valid auth token for protected routes
