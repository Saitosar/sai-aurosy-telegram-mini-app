# Use Cases

## V1 Use Cases

### UC1: Connect Robot to Platform

| Field | Description |
|-------|-------------|
| **Actor** | Robot operator, store manager |
| **Preconditions** | User has platform account; robot is powered and reachable by platform |
| **Flow** | 1. User initiates connection (from app or platform). 2. User selects or identifies robot. 3. Platform establishes connection. 4. Robot appears in user's fleet. |
| **Postconditions** | Robot is connected to platform and visible in app |

### UC2: Launch Mall Guide Scenario

| Field | Description |
|-------|-------------|
| **Actor** | Store manager, robot operator |
| **Preconditions** | User has connected robot; Mall Guide scenario is available |
| **Flow** | 1. User selects robot. 2. User selects Mall Guide scenario. 3. User starts scenario. 4. Platform executes scenario on robot. 5. User monitors progress. |
| **Postconditions** | Mall Guide scenario is running on selected robot; user sees status |

### UC3: Browse and Acquire Robots from Robot Store

| Field | Description |
|-------|-------------|
| **Actor** | Store manager, robot operator |
| **Preconditions** | User has platform account; store has available robots |
| **Flow** | 1. User opens Robot Store. 2. User browses catalog. 3. User views robot details. 4. User acquires robot. 5. Platform adds robot to user's fleet. |
| **Postconditions** | Robot is in user's fleet and available for use |

### UC4: View Robot Data and Send Commands from Control Panel

| Field | Description |
|-------|-------------|
| **Actor** | Robot operator |
| **Preconditions** | User has connected robot |
| **Flow** | 1. User opens control panel. 2. User selects robot. 3. User views robot data (telemetry, status). 4. User sends command. 5. Platform executes command on robot. |
| **Postconditions** | Command is executed; robot state is updated; user sees updated data |

## V2 Use Cases (Planned)

### UC5: Discover and Acquire Scenarios from Marketplace

| Field | Description |
|-------|-------------|
| **Actor** | Store manager, robot operator, scenario developer |
| **Preconditions** | Marketplace is available; scenarios are published |
| **Flow** | 1. User opens Marketplace. 2. User browses scenarios. 3. User views scenario details. 4. User acquires scenario. 5. Scenario is available for use. |
| **Postconditions** | Scenario is in user's library and can be run on compatible robots |

### UC6: Simulate Scenario and Preview Robot Execution

| Field | Description |
|-------|-------------|
| **Actor** | Store manager, robot operator |
| **Preconditions** | User has scenario; simulation/preview is supported |
| **Flow** | 1. User selects scenario. 2. User starts simulation. 3. User previews expected robot behavior. 4. User decides to run on real robot or adjust. |
| **Postconditions** | User has visibility into scenario behavior before live execution |
