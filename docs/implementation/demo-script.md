# V1 Demo Script

Step-by-step script for demonstrating the SAI AUROSY Telegram Mini App.

## Prerequisites

### Environment

- **Mock mode (no platform):** Leave `PLATFORM_API_URL` unset. App uses in-memory mock data and mock auth.
- **Pilot mode (with platform):** Set `PLATFORM_API_URL` to SAI AUROSY Control Plane base URL (e.g. `http://localhost:8080` when running `docker compose up` in the platform repo). App requires valid auth token for protected routes.

### Telegram

- Create a bot via [@BotFather](https://t.me/BotFather)
- Set the Web App URL to your deployed frontend (or use ngrok/tunnel for local dev)
- For local dev without Telegram, the app runs with mock data and skips auth

### Running the App

```bash
# Install and run both frontend and backend
npm install
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## Demo Flow

### 1. Open the App

- Open the Mini App from Telegram (or http://localhost:5173 for local dev)
- **Expected:** App loads; Dashboard or main navigation visible
- **Mock mode:** No auth required; loads immediately
- **Pilot mode:** If not authenticated, protected routes may return 401

### 2. View Robots

- Navigate to **Robots** (tab or menu)
- **Expected:** List of robots with name, model, status indicator (online/offline/busy)
- **Mock mode:** Robot A, Robot B, Store Bot
- **Pilot mode:** Robots from SAI AUROSY platform

### 3. Select Robot and Open Control Panel

- Tap a robot to open Control Panel (or navigate via Robots → Control)
- **Expected:** Robot header (name, model, status), Telemetry section (position, battery), Commands section
- **Telemetry:** Position (x, y), battery bar; "Last updated" and stale indicator when implemented

### 4. Send Stop Command

- Tap **Stop** button
- **Expected:** Command sent; success or error feedback shown
- **Mock mode:** Returns 200 (no-op)
- **Pilot mode:** Forwards to platform `POST /api/v1/robots/{id}/command`

### 5. Mall Guide — Start Scenario

- Navigate to **Mall Guide** (or from Control Panel → Start Mall Guide)
- Select a robot from dropdown
- Tap **Start Mall Guide**
- **Expected:** Scenario starts; status shows "Running"; progress bar (Waypoint X/Y)
- **Mock mode:** In-memory execution; progress updates
- **Pilot mode:** Creates task via platform; polls task status

### 6. Monitor Progress

- While running, observe progress bar and status
- **Expected:** "Running" label; Waypoint count updates
- **Optional:** Open Control Panel to see robot telemetry and Stop Scenario

### 7. Stop Mall Guide

- Tap **Stop Mall Guide**
- **Expected:** Scenario stops; status shows "Stopped" or "Completed"; feedback message
- **Transition:** Final status visible for 2–3 seconds before clearing

### 8. Open Control Panel from Mall Guide

- With robot selected, tap **Open Control Panel**
- **Expected:** Navigates to Control Panel with robot context; if scenario was running, shows "Active Scenario" with Stop Scenario option

## Expected Outcomes Summary

| Step | Outcome |
|------|---------|
| Open app | Loads; navigation visible |
| Robots | List of robots with status |
| Control Panel | Robot info, telemetry, commands |
| Stop command | Feedback (success/error) |
| Start Mall Guide | Running status, progress |
| Stop Mall Guide | Stopped/Completed, feedback |

## Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| **401 Unauthorized** | No token or invalid token in pilot mode | Ensure `POST /auth/login` succeeded; token in sessionStorage |
| **502 Bad Gateway** | Platform unreachable | Check `PLATFORM_API_URL`; ensure SAI AUROSY Control Plane is running |
| **Stale data** | Telemetry polling failed or slow | Check network; platform may be overloaded |
| **Mock data only** | `PLATFORM_API_URL` not set | Expected for demo mode; set for pilot mode |
