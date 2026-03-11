# Design System

Design tokens and UI patterns for the SAI AUROSY Telegram Mini App. Design tokens are defined in `frontend/src/styles/theme.css`.

## Theme

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#09090b` | Page background |
| `--foreground` | `#fafafa` | Primary text |
| `--primary` | `#00e5ff` | Accent, CTAs, online status |
| `--primary-foreground` | `#000000` | Text on primary |
| `--card` | `#121212` | Card backgrounds |
| `--muted` | `#27272a` | Muted surfaces |
| `--muted-foreground` | `#a1a1aa` | Secondary text |
| `--destructive` | `#7f1d1d` | Error, stop actions |
| `--border` | `#27272a` | Borders |
| `--ring` | `#00e5ff` | Focus rings |

Additional tokens: `--popover`, `--accent`, `--input`, `--input-background`, `--switch-background`, `--chart-1` through `--chart-5`, `--sidebar-*`.

### Typography

- **Font:** Inter (400, 500, 600, 700)
- **Base size:** 16px (`--font-size`)

| Element | Size | Weight |
|---------|------|--------|
| h1 | 1.5rem | 700 |
| h2 | 1.25rem | 600 |
| h3 | 1.125rem | 600 |
| h4 | 1rem | 500 |
| label | 1rem | 500 |
| button | 1rem | 500 |
| input | 1rem | 400 |

### Radius

- `--radius`: 0.75rem (base)
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` derived from base

## Background

Body uses a subtle grid overlay:

```css
background-image:
  linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
background-size: 24px 24px;
background-attachment: fixed;
```

## Status Indicators

| Status | Color | Glow |
|--------|-------|------|
| Online | `--primary` (cyan) | `shadow-[0_0_8px_rgba(0,229,255,0.8)]` |
| Offline | `#333` | — |
| Busy | `yellow-400` | `shadow-[0_0_8px_rgba(250,204,21,0.8)]` |

## Components

### Skeleton

Loading placeholder with pulse animation. Use for Store, Robots, and Mall Guide screens during data fetch.

```tsx
import { Skeleton } from "../../components/ui/Skeleton";

<Skeleton className="h-8 w-40" />
```

### Cards

- Background: `bg-[#111111]/80 backdrop-blur-sm`
- Border: `border border-white/5`
- Radius: `rounded-2xl`
- Hover: `hover:border-primary/30`

### Buttons

- **Primary:** `bg-primary text-black` with glow
- **Secondary:** `bg-white/5` or `bg-[#1f1f22]`
- **Destructive:** `bg-red-500/10 text-red-500 border border-red-500/30`

## Files

- `frontend/src/styles/fonts.css` — Inter font import
- `frontend/src/styles/theme.css` — CSS variables and `@theme inline` for Tailwind
- `frontend/src/index.css` — Import order: fonts → theme → tailwindcss; base styles and typography in `@layer base`
- `frontend/src/components/ui/Skeleton.tsx` — Skeleton component
- `frontend/src/components/ui/utils.ts` — `cn()` utility
