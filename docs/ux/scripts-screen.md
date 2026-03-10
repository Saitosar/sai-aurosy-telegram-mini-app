# Scripts Screen

## User Goal

Browse available scripts by type (Behavioral, Speech, Hybrid) and open a script to run on a robot.

## Screen Location

- **Route:** `/scripts`
- **Access:** From Dashboard (Scripts card), tab bar, Robots screen, Control Panel

## Layout

- **Header** — "Scripts" title and short description
- **Behavioral section** — Scripts for navigation, waypoints, physical actions (e.g., Mall Guide)
- **Speech section** — Voice-triggered scripts (e.g., greet when "Salam" is heard)
- **Hybrid section** — Combined speech + physical actions
- **Create Script card** — Disabled; tooltip "В разработке" on hover

## Script Card

- Icon by type (MapPin for behavioral, Mic for speech, Layers for hybrid)
- Name and description
- "Open" button — navigates to script detail (e.g., Mall Guide)
- "Coming soon" — for scripts without a detail screen yet

## Create Script Card

- Plus icon, "Create Script" title
- Disabled state: `cursor-not-allowed`, reduced opacity
- Tooltip on hover: "В разработке"
- No click action — feature in development

## Expected Outcomes

- User sees scripts grouped by type
- User can open Mall Guide (and future scripts with detail screens)
- User understands Create Script is not yet available
