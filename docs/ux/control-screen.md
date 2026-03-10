# Control Screen

## User Goal

View robot data (telemetry, status) and send commands. Monitor robot state in real time and take control actions.

## Screen Location

- **Route:** `/control/:robotId`
- **Access:** From Robots screen (tap robot) or from Mall Guide (select robot)

## Actions

| Action | Description | Outcome |
|--------|-------------|---------|
| View robot info | See name, model, status | Info displayed |
| View telemetry | See position, sensors, status | Live or polled data |
| Send command | Execute command (move, stop, custom) | Command sent; status updated |
| Start scenario | Launch scenario (e.g., Mall Guide) | Navigate to scenario or start inline |
| Stop scenario | Stop running scenario | Scenario stopped |

## Layout

- **Robot header** — Name, model, status indicator
- **Telemetry section** — Position, battery, sensors (TBD)
- **Command buttons** — Primary commands (e.g., Stop, Go Home, Custom)
- **Status stream** — Recent events or log (TBD)
- **Scenario shortcut** — Link to start Mall Guide or other scenarios

## Expected Outcomes

- User sees current robot status and telemetry
- User can send commands; feedback (success/error) is shown
- User can start or stop scenarios
- Status updates in near real time (polling or stream)

## Wireframe (Conceptual)

```
+---------------------------+
| Robot A            ● Online|
| Model X                   |
+---------------------------+
| Status                    |
| Position: x, y            |
| Battery: 85%              |
+---------------------------+
| [Stop] [Go Home] [Custom] |
+---------------------------+
| Running: Mall Guide       |
| [Stop Scenario]           |
+---------------------------+
| [Start Mall Guide]        |
+---------------------------+
| [< Back to Robots]        |
+---------------------------+
```
