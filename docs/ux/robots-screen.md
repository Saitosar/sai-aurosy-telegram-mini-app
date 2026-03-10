# Robots Screen

## User Goal

View and manage robots connected to the user's platform account. Quickly see status, connect new robots, and navigate to control or scenario execution.

## Screen Location

- **Route:** `/robots`
- **Access:** From Dashboard (tab/menu) or after acquiring a robot from Store

## Actions

| Action | Description | Outcome |
|--------|-------------|---------|
| View list | See all connected robots | List of robots with status |
| Connect robot | Add a new robot to fleet | Navigate to connection flow or modal |
| Disconnect | Remove robot from account | Robot removed from list |
| Select robot | Choose robot for control or scenario | Navigate to Control Panel or Mall Guide |

## Layout

- **List or cards** — One item per robot
- **Status indicators** — Online, offline, busy, error (TBD)
- **Robot info** — Name, model, last seen (TBD)
- **Actions** — Tap to open Control Panel; secondary actions (disconnect, run scenario)
- **Empty state** — "No robots yet" with CTA to connect or visit Store

## Expected Outcomes

- User sees current list of robots and their status
- User can connect a new robot (flow TBD: select from unclaimed list, scan, or enter ID)
- User can disconnect a robot (with confirmation)
- User can tap a robot to open Control Panel or start Mall Guide

## Wireframe (Conceptual)

```
+---------------------------+
| Robots                    |
+---------------------------+
| [Robot A]  ● Online       |
| Mall Guide • Model X      |
| [Control] [Mall Guide]    |
+---------------------------+
| [Robot B]  ○ Offline      |
| Store Bot • Model Y       |
| [Control] [Connect]       |
+---------------------------+
| [+ Connect robot]         |
+---------------------------+
| [Dashboard] [Store] [Mall]|
+---------------------------+
```
