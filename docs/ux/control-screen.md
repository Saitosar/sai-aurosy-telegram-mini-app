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
| Manual control | Joystick, mode buttons, body control | Movement and rotation commands sent |
| Start scenario | Launch scenario (e.g., Mall Guide) | Navigate to scenario or start inline |
| Stop scenario | Stop running scenario | Scenario stopped |

## Layout

- **Robot header** — Name, model, status indicator
- **Info / Manage tabs** — Switch between Info (telemetry, commands, scenario) and Manage (manual control)
- **Info tab:** Robot card, RobotMetricsPanel (telemetry: communication quality, casing/winding temperature, location, battery, alarms), command buttons (Stop, Go Home), scenario blocks. Tap a metric row to highlight and focus; alarms show "No current anomalies" when none.
- **Manage tab:** Manual control with robot avatar (center), virtual joystick (left), red alert/stop button, movement modes (Posture above, Walk/Run below), body control (Head/Waist rotation as circular buttons), REMOTE OPERATION MODE indicator

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
| RobotMetricsPanel         |
| Communication Quality 95% |
| Casing 42°C Winding 38°C  |
| Location: x, y            |
| Battery: 85%              |
| Alarms: No anomalies      |
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
