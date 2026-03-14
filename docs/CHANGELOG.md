# Changelog

## Design Refresh: Apple-Style Premium UI (2025-03)

### Summary

Refactored the SAI AUROSY Telegram Mini App UI from a neon/tech aesthetic to a premium Apple (macOS/iOS) style. Changes are frontend-only; no API or backend modifications.

### Changes

**Design Tokens**
- Primary color: `#00e5ff` (cyan) → `#007AFF` (iOS blue)
- Toxic/accent: `#39ff14` → `#34C759` (iOS green)
- Background (dark): `#09090b` → `#000000`
- Background (light): `#f4f4f5` → `#F2F2F7`
- Removed `--glass-glow`; softened glass tokens (blur 12–16px, no glow)

**Typography**
- Inter font weights: added 300, removed 700
- Heading weights: 700 → 600 for h1, refined letter-spacing

**Base Styles**
- Removed grid overlay and radial gradient from body background
- Glass components: reduced blur, replaced strong shadows with soft neutral shadows

**Layout**
- Tab bar: removed scale/glow from active state; labels 11px font-medium (no uppercase)

**Screens & Components**
- Removed glow, drop-shadow, and scale-on-hover from cards and buttons
- Replaced neon accents with design tokens (`text-foreground`, `text-muted-foreground`, `text-primary`)
- Primary buttons: `hover:opacity-90` instead of glow/shadow
- Cards: `hover:bg-muted/30` instead of border glow and scale

**Documentation**
- Updated `docs/ux/design-system.md` with new tokens and Apple-style guidelines

### Files Modified

- `frontend/src/styles/fonts.css`
- `frontend/src/styles/theme.css`
- `frontend/src/index.css`
- `frontend/src/components/layout/AppLayout.tsx`
- All screen components (Dashboard, Wallet, Store, Robots, Settings, Control, Scripts, Mall Guide, Demo)
- Wallet components (ProfileInfoCard, TonWalletSection, MockActions)
- `docs/ux/design-system.md`
