# Integration with SAI AUROSY Platform

See [Platform Reference](platform-reference.md) for platform project locations and integration principles. The Mini App does not create scenarios internally—the scenario engine runs on the platform. Mock data is used only when `PLATFORM_API_URL` is unset.

## Integration Pattern

The Mini App acts as an **API consumer**. It sends HTTP requests to the **NestJS backend** (Mini App Gateway) at `VITE_API_BASE_URL`. The backend proxies requests to the SAI AUROSY platform when `PLATFORM_API_URL` is set, or serves mock data when unset. The platform is the single source of truth for all business data and robot state.

**Path mapping:** The backend maps app paths to platform paths where they differ. For example, the app uses `POST /robots/:id/commands` while the SAI AUROSY platform uses `POST /robots/:id/command` (singular); the backend translates between them.

## Integration Boundaries

```mermaid
flowchart TB
    subgraph Boundary1 [Boundary 1: Mini App]
        MiniAppUI[UI]
        ApiClient[API Client]
        Session[Session Storage]
    end

    subgraph Boundary2 [Boundary 2: NestJS Backend - Gateway]
        GatewayProxy[Request Proxy]
        CORS[CORS Handler]
        MockData[Mock Data when PLATFORM_API_URL unset]
    end

    subgraph Boundary3 [Boundary 3: Platform API]
        AuthAPI[Auth API]
        RobotsAPI[Robots API]
        StoreAPI[Store API - V2 Marketplace]
        ScenariosAPI[Scenarios API]
        TelemetryAPI[Telemetry API]
    end

    subgraph Boundary4 [Boundary 4: Platform Internal]
        PlatformServices[Platform Services]
        RobotGateway[Robot Gateway]
        RobotAdapters[Robot Adapters]
    end

    MiniAppUI --> ApiClient
    ApiClient --> Session
    ApiClient -->|"VITE_API_BASE_URL"| GatewayProxy
    GatewayProxy --> CORS
    GatewayProxy -->|"PLATFORM_API_URL"| AuthAPI
    AuthAPI --> PlatformServices
    RobotsAPI --> PlatformServices
    StoreAPI -.->|"V1: mock only"| PlatformServices
    ScenariosAPI --> PlatformServices
    TelemetryAPI --> PlatformServices
    PlatformServices --> RobotGateway
    RobotGateway --> RobotAdapters
```

| Boundary | Components | Responsibility |
|----------|------------|----------------|
| **1. Mini App** | UI, API client, session | User interface, API calls, token storage |
| **2. NestJS Backend** | Proxy, CORS, mock data | Request forwarding, path mapping, mock when platform unset |
| **3. Platform API** | Auth, Robots, Scenarios, Telemetry; Store (V2 Marketplace) | API surface; Store in V1 is backend mock only |
| **4. Platform Internal** | Services, Robot Gateway, Adapters | Business logic, robot connectivity |

## Request Flow

In this project, the Mini App **always** calls the NestJS backend. The backend either proxies to the platform or serves mock data.

```mermaid
flowchart LR
    subgraph WithPlatform [PLATFORM_API_URL set]
        App1[Mini App] --> Backend1[NestJS Backend] --> API1[Platform API] --> Svc1[Platform Services] --> RG1[Robot Gateway] --> RA1[Robot Adapters] --> R1[Robots]
    end

    subgraph DemoMode [PLATFORM_API_URL unset]
        App2[Mini App] --> Backend2[NestJS Backend] --> Mock[Mock Data]
    end
```

**With platform:** Mini App → NestJS Backend → Platform API → Platform Services → Robot Gateway → Robot Adapters → Robots

**Demo mode:** Mini App → NestJS Backend → mock data (no platform call)

The backend only proxies or serves mocks; it does not implement business logic or persist data.

## Telemetry Flow

Telemetry originates from robots and flows to the Mini App via the platform. The Mini App never receives telemetry directly from robots.

```mermaid
flowchart LR
    subgraph TelemetryFlow [Telemetry Flow]
        Robot[Robot] --> Adapter[Robot Adapter] --> Platform[Platform Telemetry Service] --> API[Platform API] --> Backend[NestJS Backend]
        Backend --> MiniApp[Mini App]
    end
```

1. **Robot** — Sends telemetry (position, status, sensors) to the platform via its adapter
2. **Robot Adapter** — Receives robot-specific data; normalizes and forwards to platform
3. **Platform Telemetry Service** — Aggregates, stores, and exposes via API (stream or poll)
4. **Platform API** — Exposes `/telemetry/:robotId` or WebSocket stream
5. **NestJS Backend** — Proxies telemetry (or serves mock) to the Mini App
6. **Mini App** — Polls backend; displays status to user

## Commands and Scenario Launch Flow

User actions (e.g., send command, start Mall Guide) flow through the platform to robots.

```mermaid
sequenceDiagram
    participant User
    participant MiniApp
    participant Backend as NestJS Backend
    participant Platform
    participant RobotGateway
    participant Adapter
    participant Robot

    User->>MiniApp: Tap Start Mall Guide
    MiniApp->>Backend: POST /scenarios/:id/run { robotId }
    Backend->>Platform: Forward request
    Platform->>Platform: Validate user, robot, scenario
    Platform->>RobotGateway: Execute scenario on robot
    RobotGateway->>Adapter: Translate and send
    Adapter->>Robot: Robot-specific command
    Robot->>Adapter: Ack / telemetry
    Adapter->>Platform: Status update
    Platform->>Backend: 200 { executionId }
    Backend->>MiniApp: Response
    MiniApp->>User: Show running status
```

See [Mall Guide Scenario Execution Sequence](#mall-guide-scenario-execution-sequence) below for the full flow.

## Mall Guide Scenario Execution Sequence

End-to-end sequence for launching and monitoring the Mall Guide scenario.

```mermaid
sequenceDiagram
    participant User
    participant MiniApp
    participant Backend as NestJS Backend
    participant Platform
    participant ScenarioSvc
    participant RobotGateway
    participant Adapter
    participant Robot

    User->>MiniApp: Select robot, tap Start
    MiniApp->>Backend: POST /scenarios/:id/run { robotId } (id=mall-guide)
    Backend->>Platform: POST /api/v1/tasks { robot_id, scenario_id }
    Platform->>ScenarioSvc: Start Mall Guide
    ScenarioSvc->>Platform: Validate ownership, compatibility
    ScenarioSvc->>RobotGateway: Execute scenario
    RobotGateway->>Adapter: Scenario commands
    Adapter->>Robot: Start Mall Guide
    Robot->>Adapter: Running
    Adapter->>Platform: Telemetry
    Platform->>Backend: 201 { executionId }
    Backend->>MiniApp: Response
    MiniApp->>User: Status: Running

    loop Monitor
        Robot->>Adapter: Telemetry
        Adapter->>Platform: Update
        MiniApp->>Backend: GET /scenarios/:id/executions/:executionId
        Backend->>Platform: GET /api/v1/tasks/:executionId
        Platform->>Backend: Status, progress
        Backend->>MiniApp: Response
        MiniApp->>User: Update UI
    end

    User->>MiniApp: Tap Stop
    MiniApp->>Backend: POST .../executions/:id/stop
    Backend->>Platform: POST /api/v1/tasks/:id/cancel
    Platform->>RobotGateway: Stop
    RobotGateway->>Adapter: Stop command
    Adapter->>Robot: Stop
    Robot->>Adapter: Stopped
    Platform->>Backend: 200
    Backend->>MiniApp: Response
    MiniApp->>User: Status: Stopped
```

## Authentication Flow

See [Authentication and Security](auth-and-security.md) for the full Telegram authentication sequence with Bot and WebApp roles.

Summary: User opens Mini App from Telegram → App reads `initData` → App sends to NestJS backend → Backend forwards to Platform (when `PLATFORM_API_URL` set) → Platform validates HMAC → Platform issues session tokens → App stores and uses for API requests.

## API Domains

| Domain | Purpose |
|--------|---------|
| **Auth** | Login (init data), refresh, logout |
| **Robots** | List, get, connect, disconnect, commands |
| **Store** | List items, acquire (V1: backend mock only; platform Store API not implemented) |
| **Scenarios** | List, get, run (Mall Guide), status |
| **Telemetry** | Subscribe/stream or poll robot status |

See [API Overview](../api/api-overview.md) for details.

## Error Handling

- **401 Unauthorized** — Token expired or invalid; app should refresh or re-authenticate
- **403 Forbidden** — User lacks permission; show appropriate message
- **404 Not Found** — Resource does not exist or user has no access
- **5xx Server Error** — Platform issue; show retry or contact support
- **Network failure** — Show offline message; retry when connection restored

## Offline Behavior

- The app does not cache business data for offline use.
- When offline: show connection error, disable actions that require API.
- When back online: refresh data and re-enable actions.
- Session token may expire while offline; re-authenticate on next request if needed.

## Versioning and Compatibility

- Platform API version: TBD (e.g., `/v1/` prefix or `Accept-Version` header)
- App should declare supported API version.
- Breaking changes: platform to communicate deprecation; app to update before cutoff.
- Non-breaking changes: app should tolerate new fields and optional parameters.
