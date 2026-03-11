# TON Wallet Integration

This document describes the TON Connect integration in the SAI AUROSY Telegram Mini App.

## Overview

The app uses [@tonconnect/ui-react](https://www.npmjs.com/package/@tonconnect/ui-react) to connect TON wallets. Users can connect their wallet from the Dashboard, view their address, and use mock actions (Reserve Robot, Pay Demo Deposit). No blockchain transactions are performed yet.

## Setup

### Dependencies

```bash
npm install @tonconnect/ui-react
```

### Manifest

The app serves a TON Connect manifest at `/tonconnect-manifest.json`. It must be publicly accessible. Required fields:

- **url** — App URL (e.g. `https://yourapp.com` or `http://localhost:5173` for dev)
- **name** — App name (e.g. "SAI AUROSY")
- **iconUrl** — URL to app icon (PNG or ICO, 180x180 px recommended)

For production, update `frontend/public/tonconnect-manifest.json` so `url` matches your deployed app URL.

### Provider

The app is wrapped with `TonConnectUIProvider` in `frontend/src/App.tsx`:

```tsx
<TonConnectUIProvider
  manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}
  actionsConfiguration={{ twaReturnUrl }}
>
  ...
</TonConnectUIProvider>
```

### twaReturnUrl (Telegram Mini App)

When the app runs inside Telegram and the user connects via Telegram Wallet or an external wallet, they may leave the app. `twaReturnUrl` specifies where to return after the connection flow.

Set `VITE_TWA_RETURN_URL` in `.env`:

```
VITE_TWA_RETURN_URL=https://t.me/YourBot/yourapp
```

Replace `YourBot` with your bot username and `yourapp` with your Web App slug. If unset, the SDK falls back to `window.location.href`.

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| TonWalletSection | `frontend/src/components/wallet/TonWalletSection.tsx` | Connect button, address display, disconnect |
| MockActions | `frontend/src/components/wallet/MockActions.tsx` | Reserve Robot, Pay Demo Deposit (mock) |

## Hooks Used

- `useTonAddress()` — Current wallet address (empty if disconnected)
- `useTonConnectModal()` — `open()` to show wallet selection modal
- `useTonConnectUI()` — `disconnect()` to disconnect wallet

## Mock Actions

- **Reserve Robot** — Shows "Reserved!" feedback for 3 seconds. No blockchain call.
- **Pay Demo Deposit** — Shows "Deposit paid!" feedback for 3 seconds. No blockchain call.

These are placeholders for future TON-based flows.

## Production Checklist

1. Update `tonconnect-manifest.json`:
   - Set `url` to your production app URL (no trailing slash)
   - Set `iconUrl` to a valid PNG/ICO (180x180 px recommended)

2. Set `VITE_TWA_RETURN_URL` for your Telegram bot Web App URL.

3. Ensure the manifest is served with correct CORS (Vite/build output serves static files from same origin by default).
