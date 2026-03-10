# Roadmap

## Approach

MVP-first: deliver a narrow, practical V1 before expanding. Each phase builds on the previous and depends on SAI AUROSY platform API availability.

## V1 Phases

### Phase 1: Foundation

| Deliverable | Description |
|-------------|-------------|
| Telegram Web App shell | Basic Mini App structure, Telegram SDK integration |
| Auth flow | Send Telegram init data to platform; receive and store session |
| API client | HTTP client for platform API; error handling, token attachment |
| Environment config | Base URL, bot config (TBD) |

**Dependencies:** Platform auth API (validate init data, issue session)

### Phase 2: Core

| Deliverable | Description |
|-------------|-------------|
| Robots screen | List user's robots; connect/disconnect |
| Robot Store screen | Browse catalog; view details; acquire |
| Control panel | View robot data; send commands |
| Navigation | Tab bar or menu; screen routing |

**Dependencies:** Platform robots API, store API, commands API

### Phase 3: Mall Guide

| Deliverable | Description |
|-------------|-------------|
| Mall Guide screen | Select robot; start/stop scenario |
| Progress/status | Display scenario execution status |
| Integration | Link from Robots and Control Panel to Mall Guide |

**Dependencies:** Platform scenarios API (list, run, status)

## V2 Phases (Planned)

### Phase 4: Marketplace

| Deliverable | Description |
|-------------|-------------|
| Marketplace screen | Browse scenarios from third-party developers |
| Scenario details | Description, compatibility, pricing (if applicable) |
| Acquisition flow | Add scenario to user's library |

**Dependencies:** Platform marketplace API

### Phase 5: Simulation & Preview

| Deliverable | Description |
|-------------|-------------|
| Simulation mode | Run scenario in simulation environment |
| Preview | Visualize expected robot behavior |
| Run on robot | Option to execute on real robot after preview |

**Dependencies:** Platform simulation/preview API

## Milestones

| Milestone | Target |
|-----------|--------|
| V1 Foundation complete | TBD |
| V1 Core complete | TBD |
| V1 Mall Guide complete | TBD |
| V2 Marketplace | TBD |
| V2 Simulation | TBD |

## Platform API Dependencies

The app requires the following platform capabilities:

- **Auth:** Validate Telegram init data; issue and refresh session
- **Robots:** List, get, connect, disconnect, send commands
- **Store:** List items, acquire
- **Scenarios:** List, get, run (Mall Guide), status
- **Telemetry:** Stream or poll robot status

Platform API documentation and base URLs are TBD.
