# V1 Acceptance Criteria

Acceptance criteria for the SAI AUROSY Telegram Mini App V1 demo quality release.

## Auth

- [ ] **Protected routes:** When `PLATFORM_API_URL` is set, protected routes (robots, store, scenarios, telemetry) return 401 when no valid Bearer token is provided
- [ ] **Mock mode:** When `PLATFORM_API_URL` is not set, all routes allow unauthenticated access for demo
- [ ] **Auth endpoints:** `POST /auth/login` and `POST /auth/logout` remain public (no AuthGuard)

## DTOs

- [ ] **Response conformity:** All API responses conform to shared DTOs (Robot, RobotDetail, Scenario, ScenarioExecution, Telemetry, StoreItem)
- [ ] **Mapping layer:** Platform responses pass through mappers that normalize field names and structure (e.g. `robot_id` → `id`)
- [ ] **Defensive handling:** Mappers handle missing or unexpected fields with sensible defaults

## Connection and Telemetry

- [ ] **Last updated:** Telemetry section in Control Panel shows "Last updated: Xs ago" or equivalent
- [ ] **Stale indicator:** When telemetry is older than 10 seconds, show subtle "Data may be outdated" or amber indicator
- [ ] **Polling fallback:** Polling transport remains primary when SSE is unavailable

## Control Panel UX

- [ ] **Command feedback:** Command success or error is shown (inline message or toast); no silent failures
- [ ] **Scenario visibility:** When scenario is stopped, show "Scenario stopped" state; when execution completes, show "Completed"
- [ ] **Stop scenario feedback:** Success or error message after Stop Scenario action
- [ ] **Custom Command:** Remains disabled with tooltip explaining platform support is pending

## Mall Guide UX

- [ ] **Status labels:** Explicit status text: "Running", "Completed", "Stopped", "Error" (not just progress bar)
- [ ] **Transition handling:** When status is completed/stopped/error, show final status for 2–3 seconds before clearing or show "Scenario completed" card
- [ ] **Error display:** When status is "error", show error state with retry or "Start again" option
- [ ] **Idle state:** When no execution, show "Idle" or "Ready to start"

## Audit

- [ ] **Command logging:** Backend logs robot commands (robotId, command, timestamp) when commands are sent
- [ ] **Scenario logging:** Backend logs scenario run and stop actions (scenarioId, robotId, executionId, timestamp)

## Demo Mode

- [ ] **Demo mode:** App works without `PLATFORM_API_URL`; mock data and mock auth
- [ ] **Pilot mode:** When `PLATFORM_API_URL` is set, requires valid auth token for protected routes
