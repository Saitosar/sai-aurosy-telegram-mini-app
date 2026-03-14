# Design System

Design tokens and UI patterns for the SAI AUROSY Telegram Mini App. Design tokens are defined in `frontend/src/styles/theme.css`. The design follows an Apple-style (macOS/iOS) premium aesthetic: refined typography, muted colors, soft shadows, and restrained interactions.

## Theme

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#000000` (dark) / `#F2F2F7` (light) | Page background |
| `--foreground` | `#fafafa` (dark) / `#18181b` (light) | Primary text |
| `--primary` | `#007AFF` | Accent, CTAs, active states (iOS blue) |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--card` | `#121212` | Card backgrounds |
| `--muted` | `#27272a` | Muted surfaces |
| `--muted-foreground` | `#a1a1aa` | Secondary text |
| `--destructive` | `#7f1d1d` | Error, stop actions |
| `--border` | `#27272a` | Borders |
| `--ring` | `#007AFF` | Focus rings |

Additional tokens: `--popover`, `--accent`, `--input`, `--input-background`, `--switch-background`, `--chart-1` through `--chart-5`, `--sidebar-*`, `--toxic` (#34C759, iOS green for Busy status, success states).

### Typography

- **Font:** Inter (300, 400, 500, 600)
- **Base size:** 16px (`--font-size`)

| Element | Size | Weight |
|---------|------|--------|
| h1 | 1.5rem | 600 |
| h2 | 1.25rem | 600 |
| h3 | 1.125rem | 500 |
| h4 | 1rem | 500 |
| label | 1rem | 500 |
| button | 1rem | 500 |
| input | 1rem | 400 |

### Radius

- `--radius`: 0.75rem (base)
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` derived from base

## Background

Body uses a solid background color. No grid overlay or radial gradients.

```css
background-color: var(--tg-theme-bg-color, var(--background));
```

## Status Indicators

| Status | Color |
|--------|-------|
| Online | `--primary` (#007AFF) |
| Offline | `--muted` |
| Busy | `--toxic` (#34C759) |

## Components

### Skeleton

Loading placeholder with pulse animation. Use for Store, Robots, and Mall Guide screens during data fetch.

```tsx
import { Skeleton } from "../../components/ui/Skeleton";

<Skeleton className="h-8 w-40" />
```

### Cards

- Use `.glass-card` for elevated surfaces
- Blur: 16px, soft shadow: `0 2px 12px rgba(0,0,0,0.2)`
- Radius: `rounded-2xl`
- Hover: `hover:bg-muted/30` (no scale or glow)

### Buttons

- **Primary:** `bg-primary text-primary-foreground` with `hover:opacity-90` (no glow)
- **Secondary:** `glass-button-secondary` or `bg-muted`
- **Destructive:** `bg-red-500/10 text-red-500 border border-red-500/30`

## Apple-Style Guidelines

- **No glow effects** — Avoid `drop-shadow`, `box-shadow` with colored rgba
- **Soft shadows** — Use neutral shadows: `0 2px 8px rgba(0,0,0,0.04)` (light) or `0 2px 12px rgba(0,0,0,0.2)` (dark)
- **Restrained hover** — Prefer `hover:opacity-90` or `hover:bg-muted/50` over scale or glow
- **Typography** — Lighter weights (500–600 for headings), refined letter-spacing
- **Glass components** — Softer blur (12–16px), no glow in glass tokens

## Files

- `frontend/src/styles/fonts.css` — Inter font import
- `frontend/src/styles/theme.css` — CSS variables and `@theme inline` for Tailwind
- `frontend/src/index.css` — Import order: fonts → theme → tailwindcss; base styles and typography in `@layer base`
- `frontend/src/components/ui/Skeleton.tsx` — Skeleton component
- `frontend/src/components/ui/utils.ts` — `cn()` utility
