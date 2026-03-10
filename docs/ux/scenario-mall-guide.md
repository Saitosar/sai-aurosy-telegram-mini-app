# Scenario: Mall Guide

## User Goal

Run the Mall Guide scenario on a selected robot. Start, monitor progress, and stop when needed.

## Screen Location

- **Route:** `/scripts/mall-guide`
- **Access:** From Dashboard (Scripts card), Scripts list, Robots, Control Panel

## Actions

| Action | Description | Outcome |
|--------|-------------|---------|
| Back | Return to Scripts screen | Navigates to `/scripts` |
| Select robot | Choose robot to run scenario | Robot selected |
| Start scenario | Launch Mall Guide on robot | Scenario starts; progress shown |
| Monitor progress | View execution status | Status updates |
| Stop scenario | Stop running scenario | Scenario stopped |

## Layout

- **Back button** — Returns to Scripts screen (in-app button and Telegram WebApp BackButton)
- **Scenario card** — Mall Guide name, description, compatibility
- **Robot selector** — Dropdown or list of user's robots
- **Start/Stop button** — Primary CTA; changes to Stop when running
- **Progress indicator** — Status text or progress bar (TBD)
- **Link to Control Panel** — Quick access to full robot control

## Expected Outcomes

- User selects a robot and starts Mall Guide
- User sees that the scenario is running (status from platform)
- User can stop the scenario at any time
- User has visibility into execution (e.g., "Patrol started", "At waypoint 3")

## Wireframe (Conceptual)

```
+---------------------------+
| ← Back                     |
+---------------------------+
| Mall Guide                |
+---------------------------+
| Guide customers through   |
| mall with waypoints.      |
+---------------------------+
| Robot: [Robot A ▼]        |
+---------------------------+
| [Start Mall Guide]        |
+---------------------------+
| Status: Idle              |
+---------------------------+
| [Open Control Panel]      |
+---------------------------+
| [Dashboard] [Robots] [Store]|
+---------------------------+
```

**When running:**
- [Stop Mall Guide] button
- Status: "Running • Waypoint 2/5" (or similar)
- Progress indicator
