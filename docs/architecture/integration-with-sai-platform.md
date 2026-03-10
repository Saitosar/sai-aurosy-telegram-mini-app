# Integration with SAI AUROSY Platform

## Integration Pattern

The Mini App acts as an **API consumer**. It sends HTTP requests (REST or GraphQL) to the SAI AUROSY platform—either directly or via the optional Mini App Gateway—and receives JSON responses. The platform is the single source of truth for all business data and robot state.

## Integration Boundaries

```mermaid
flowchart TB
    subgraph Boundary1 [Boundary 1: Mini App]
        MiniAppUI[UI]
        ApiClient[API Client]
        Session[Session Storage]
    end

    subgraph Boundary2 [Boundary 2: Gateway - Optional]
        GatewayProxy[Request Proxy]
        CORS[CORS Handler]
        TokenHandler[Token Handler]
    end

    subgraph Boundary3 [Boundary 3: Platform API]
        AuthAPI[Auth API]
        RobotsAPI[Robots API]
        StoreAPI[Store API]
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
    ApiClient -->|"HTTPS"| GatewayProxy
    ApiClient -.->|"HTTPS direct"| AuthAPI
    GatewayProxy --> CORS
    GatewayProxy --> TokenHandler
    GatewayProxy -->|"HTTPS"| AuthAPI
    AuthAPI --> PlatformServices
    RobotsAPI --> PlatformServices
    StoreAPI --> PlatformServices
    ScenariosAPI --> PlatformServices
    TelemetryAPI --> PlatformServices
    PlatformServices --> RobotGateway
    RobotGateway --> RobotAdapters
```

| Boundary | Components | Responsibility |
|----------|------------|----------------|
| **1. Mini App** | UI, API client, session | User interface, API calls, token storage |
| **2. Gateway** | Proxy, CORS, token handler | Request forwarding, cross-origin, optional refresh |
| **3. Platform API** | Auth, Robots, Store, Scenarios, Telemetry | API surface for all domains |
| **4. Platform Internal** | Services, Robot Gateway, Adapters | Business logic, robot connectivity |

## Request Flow

API requests follow one of two paths depending on whether the Gateway is deployed.

```mermaid
flowchart LR
    subgraph WithGateway [With Gateway]
        App1[Mini App] --> GW[Gateway] --> API1[Platform API] --> Svc1[Platform Services] --> RG1[Robot Gateway] --> RA1[Robot Adapters] --> R1[Robots]
    end

    subgraph WithoutGateway [Without Gateway]
        App2[Mini App] --> API2[Platform API] --> Svc2[Platform Services] --> RG2[Robot Gateway] --> RA2[Robot Adapters] --> R2[Robots]
    end
```

**Path with Gateway:** Mini App → Gateway → Platform API → Platform Services → Robot Gateway → Robot Adapters → Robots

**Path without Gateway:** Mini App → Platform API → Platform Services → Robot Gateway → Robot Adapters → Robots

The Gateway only proxies requests; it does not implement business logic or persist data.

## Telemetry Flow

Telemetry originates from robots and flows to the Mini App via the platform. The Mini App never receives telemetry directly from robots.

```mermaid
flowchart LR
    subgraph TelemetryFlow [Telemetry Flow]
        Robot[Robot] --> Adapter[Robot Adapter] --> Platform[Platform Telemetry Service] --> API[Platform API] --> Gateway[Gateway]
        Gateway --> MiniApp[Mini App]
        API -.->|"Direct"| MiniApp
    end
```

1. **Robot** — Sends telemetry (position, status, sensors) to the platform via its adapter
2. **Robot Adapter** — Receives robot-specific data; normalizes and forwards to platform
3. **Platform Telemetry Service** — Aggregates, stores, and exposes via API (stream or poll)
4. **Platform API** — Exposes `/telemetry/:robotId` or WebSocket stream
5. **Gateway** — Passes through (if present); no transformation
6. **Mini App** — Subscribes (WebSocket) or polls; displays status to user

## Commands and Scenario Launch Flow

User actions (e.g., send command, start Mall Guide) flow through the platform to robots.

```mermaid
sequenceDiagram
    participant User
    participant MiniApp
    participant Gateway
    participant Platform
    participant RobotGateway
    participant Adapter
    participant Robot

    User->>MiniApp: Tap Start Mall Guide
    MiniApp->>Gateway: POST /scenarios/:id/run { robotId }
    Gateway->>Platform: Forward request
    Platform->>Platform: Validate user, robot, scenario
    Platform->>RobotGateway: Execute scenario on robot
    RobotGateway->>Adapter: Translate and send
    Adapter->>Robot: Robot-specific command
    Robot->>Adapter: Ack / telemetry
    Adapter->>Platform: Status update
    Platform->>Gateway: 200 { executionId }
    Gateway->>MiniApp: Response
    MiniApp->>User: Show running status
```

See [Mall Guide Scenario Execution Sequence](#mall-guide-scenario-execution-sequence) below for the full flow.

## Mall Guide Scenario Execution Sequence

End-to-end sequence for launching and monitoring the Mall Guide scenario.

```mermaid
sequenceDiagram
    participant User
    participant MiniApp
    participant Gateway
    participant Platform
    participant ScenarioSvc
    participant RobotGateway
    participant Adapter
    participant Robot

    User->>MiniApp: Select robot, tap Start
    MiniApp->>Gateway: POST /scenarios/mall-guide/run { robotId }
    Gateway->>Platform: Forward
    Platform->>ScenarioSvc: Start Mall Guide
    ScenarioSvc->>Platform: Validate ownership, compatibility
    ScenarioSvc->>RobotGateway: Execute scenario
    RobotGateway->>Adapter: Scenario commands
    Adapter->>Robot: Start Mall Guide
    Robot->>Adapter: Running
    Adapter->>Platform: Telemetry
    Platform->>Gateway: 201 { executionId }
    Gateway->>MiniApp: Response
    MiniApp->>User: Status: Running

    loop Monitor
        Robot->>Adapter: Telemetry
        Adapter->>Platform: Update
        MiniApp->>Gateway: GET /scenarios/.../executions/:id
        Gateway->>Platform: Forward
        Platform->>MiniApp: Status, progress
        MiniApp->>User: Update UI
    end

    User->>MiniApp: Tap Stop
    MiniApp->>Gateway: POST .../executions/:id/stop
    Gateway->>Platform: Forward
    Platform->>RobotGateway: Stop
    RobotGateway->>Adapter: Stop command
    Adapter->>Robot: Stop
    Robot->>Adapter: Stopped
    Platform->>MiniApp: 200
    MiniApp->>User: Status: Stopped
```

## Authentication Flow

See [Authentication and Security](auth-and-security.md) for the full Telegram authentication sequence with Bot and WebApp roles.

Summary: User opens Mini App from Telegram → App reads `initData` → App sends to Platform (via Gateway or direct) → Platform validates HMAC → Platform issues session tokens → App stores and uses for API requests.

## API Domains

| Domain | Purpose |
|--------|---------|
| **Auth** | Login (init data), refresh, logout |
| **Robots** | List, get, connect, disconnect, commands |
| **Store** | List items, acquire |
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
