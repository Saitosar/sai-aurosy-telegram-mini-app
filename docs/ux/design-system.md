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
| `--muted-foreground-accessible` | `#b4b4bc` | Higher-contrast secondary text (optional) |
| `--destructive` | `#7f1d1d` | Error, stop actions |
| `--border` | `#27272a` | Borders |
| `--ring` | `#007AFF` | Focus rings |

Additional tokens: `--popover`, `--accent`, `--input`, `--input-background`, `--switch-background`, `--chart-1` through `--chart-5`, `--sidebar-*`, `--toxic` (#34C759, iOS green for Busy status, success states).

### Semantic colors

| Token | Value | Usage |
|-------|-------|-------|
| `--success` | #34C759 | Success states, completed (iOS green) |
| `--success-foreground` | #ffffff | Text on success |
| `--warning` | #FF9500 | Warning, stopped (iOS orange) |
| `--warning-foreground` | #000000 | Text on warning |
| `--info` | #007AFF | Info, links (same as primary) |
| `--info-foreground` | #ffffff | Text on info |

### Accent gradient

| Token / Class | Value | Usage |
|---------------|-------|-------|
| `--gradient-accent` | linear-gradient(135deg, #007AFF, #5856D6) | Decorative accents |
| `.gradient-accent` | Same | Hero accents, special CTAs — use sparingly |

### Typography

- **Font:** Geist Variable (weights 100–900 via variable font)
- **Base size:** 17px (`--font-size`) — iOS 26: slightly increased for readability
- **Variables:** `--font-sans`

| Element | Size | Weight |
|---------|------|--------|
| h1 | clamp(1.3125rem, 5vw, 1.5625rem) | 600 |
| h2 | clamp(1.1875rem, 4vw, 1.3125rem) | 600 |
| h3 | clamp(1.0625rem, 3.5vw, 1.1875rem) | 500 |
| h4 | clamp(1rem, 3vw, 1.0625rem) | 500 |
| label | 1.0625rem | 500 |
| button | 1.0625rem | 500 |
| input | 1.0625rem | 400 |

### iOS 26 Typography

- **Left alignment** — Use `text-left` and `items-start` in alerts, onboarding flows, and EmptyState. Avoid center-aligned text in these contexts.
- **Section headers** — Use sentence case (e.g. "Visitors attracted", "Map settings") instead of ALL CAPS. Do not apply `uppercase` or `text-transform: uppercase` to list/section headers.
- **Text sizes** — Base and heading sizes are slightly increased for better readability on iOS 26.

### Radius

- `--radius`: 1rem (base) — iOS 26: increased from 0.75rem for softer corners
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` derived from base

## Background

Body uses a solid background color. No grid overlay or radial gradients.

```css
background-color: var(--tg-theme-bg-color, var(--background));
```

## Status Indicators

Use `--status-*` tokens for consistent semantics across robot status, execution status, and UI feedback.

| Status | Token | Value |
|--------|-------|-------|
| Online | `--status-online` | var(--primary) |
| Offline | `--status-offline` | var(--muted) |
| Busy | `--status-busy` | var(--toxic) |
| Error | `--status-error` | #FF3B30 (iOS red) |
| Warning | `--status-warning` | #FF9500 (iOS orange) |

Use in CSS: `bg-[var(--status-online)]`, `text-[var(--status-error)]`, etc.

## Components

### Skeleton

Loading placeholder with pulse animation. Use for Store, Robots, and Mall Guide screens during data fetch.

```tsx
import { Skeleton } from "../../components/ui/Skeleton";

<Skeleton className="h-8 w-40" />
```

### Cards

- **`.glass-card`** — Standard elevated surfaces (lists, secondary content, settings rows)
- **`.glass-card-elevated`** — Important/featured blocks: primary CTAs, robot selection, main scenario card, online robot cards, script cards with "Open" action
- **iOS 26 Liquid Glass:** Gradient semi-transparent background, 1px light border (`--glass-border-liquid`), outer shadow (`0 8px 24px rgba(0,0,0,0.2)`), inner highlight (`inset 0 1px 0 rgba(255,255,255,0.2)`), backdrop blur 16px
- Radius: `rounded-3xl` (iOS 26: larger radii for cards)
- Hover: `hover:bg-muted/30` (no scale or glow)

### Tab Bar

- **iOS 26 floating:** The tab bar floats over content with Liquid Glass instead of being edge-attached
- **Bottom inset:** `bottom: calc(12px + env(safe-area-inset-bottom))` — 12px gap from screen edge + safe area
- **Horizontal inset:** `inset-x-4` (16px) on narrow screens, `sm:inset-x-6` (24px) on wider
- **Liquid Glass:** Uses `.glass-card` — gradient background, 1px light border, outer + inner shadow, backdrop blur 16px
- **Rounded corners:** `rounded-3xl`
- **Content clearance:** Main content uses `pb-[var(--tab-bar-spacer)]` so scrollable content does not hide behind the bar
- **Variables:** `--tab-bar-height` (64px), `--tab-bar-bottom-gap` (12px), `--tab-bar-spacer` in `theme.css`

### Visual hierarchy

- **Hero gradients:** Add `bg-gradient-to-b from-primary/5 via-transparent to-transparent` to hero/top sections for subtle depth. Use on all main screens (Dashboard, Store, Robots, Mall Guide, Control, Scripts, Settings, Profile, Wallet).
- **Elevation levels:** Use `glass-card` for standard cards, `glass-card-elevated` for featured content (see Cards above).
- **Primary vs secondary actions:**
  - Primary: `bg-primary text-primary-foreground hover:opacity-90` — main CTAs (Order, Start, Control, Sign in)
  - Secondary: `glass-button-secondary text-muted-foreground hover:text-foreground hover:bg-muted/50` — secondary actions (Details, Scripts, Close, Cancel)
  - Example: Store item — "Order" (primary) vs "Details" (secondary); Robot card — "Control" (primary) vs "Scripts" (secondary)

### Buttons

- **Primary:** `bg-primary text-primary-foreground rounded-2xl` with `hover:opacity-90` (no glow) — main CTAs (Order, Start, Control)
- **Secondary:** `glass-button-secondary rounded-2xl` with `text-muted-foreground hover:text-foreground` — secondary actions (Details, Close)
- **Destructive:** `bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl`
- **Touch targets:** Use `min-h-[44px]` or `.touch-target` for all interactive elements (WCAG 2.5.5)

## Animations (Framer Motion)

Micro-animations provide tactile feedback and polish. Use Framer Motion (`framer-motion`) consistently.

### Button tap feedback

Use `whileTap={{ scale: 0.98 }}` on interactive elements (buttons, links wrapped in `motion.div`):

```tsx
<motion.button whileTap={{ scale: 0.98 }}>Action</motion.button>
```

For `Link` components, wrap in `motion.div` with `whileTap` for tap feedback.

### Staggered list reveal

For lists and grids, use a staggered entrance:

```tsx
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.08, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {/* content */}
  </motion.div>
))}
```

### Screen transitions

Wrap the main `Outlet` in `AppLayout` with `AnimatePresence` and `motion.div` using `location.key` for route changes. Use `mode="wait"` and short opacity transitions (0.2s).

### Modal / overlay

For bottom sheets and modals, use `AnimatePresence` with:
- Backdrop: `initial={{ opacity: 0 }}, animate={{ opacity: 1 }}, exit={{ opacity: 0 }}`
- Sheet: `initial={{ y: "100%" }}, animate={{ y: 0 }}, exit={{ y: "100%" }}` (slide-up)

### Haptic pairing

Where `haptic.impact()` or `haptic.selection()` is used, add `whileTap` for visual feedback. Haptic and visual feedback should be paired on the same touch target.

## Empty State

Empty states guide users when lists or content are empty. Use the `EmptyState` component for consistent presentation. Content is left-aligned per iOS 26 guidelines.

### Basic usage

```tsx
import { EmptyState } from "../../components/ui/EmptyState";

<EmptyState
  title="No items"
  description="Add your first item to get started."
  action={{ label: "Add Item", href: "/add" }}
/>
```

### With onboarding steps

For first-time flows (e.g. "Connect your first robot in 3 steps"), pass `steps` and `progress`:

```tsx
<EmptyState
  title="No robots deployed"
  description="Подключите первого робота за 3 шага"
  action={{ label: "Browse Store", href: "/store" }}
  steps={[
    { label: "Browse Store", href: "/store", completed: step >= 2, icon: Store },
    { label: "Order robot", href: "/store", completed: step >= 3, icon: MessageCircle },
    { label: "Start control", completed: false, icon: Power },
  ]}
  progress={(step >= 2 ? 1 : 0) + (step >= 3 ? 1 : 0)}
/>
```

### Illustration and animation

When `steps` are provided, the component shows an animated robot illustration (subtle float via Framer Motion). Otherwise, a static icon in a glass container is used.

### Progress indicator

Horizontal bar with 3 segments. Completed segments use `bg-primary`, pending use `bg-muted`. Pass `progress` as the number of completed steps (0–3).

## Mobile & Accessibility

Target devices: iPhone SE (320px), iPhone 14 (390px), iPhone 16 (393px), iPhone 16 Pro Max (430px).

### Responsive layout

- **Container padding:** Use `px-4 sm:px-6` — 16px on narrow screens (&lt;640px), 24px on wider
- **Card padding:** Use `p-4 sm:p-6` for cards (iOS 26: more space between elements)
- **Grid gaps:** Use `gap-4 sm:gap-6` for grids (iOS 26: increased spacing)
- **List internal padding:** Use `p-4 sm:p-5` or `p-5 sm:p-6` for list rows

### Touch targets

- **Minimum size:** 44×44px for all interactive elements (buttons, links, icon buttons)
- **Utility:** `.touch-target` in `index.css` provides `min-height: 44px; min-width: 44px`
- **Buttons:** Add `min-h-[44px]` and `py-3` or `py-4` for sufficient height

### Focus-visible

- **Keyboard navigation:** Base styles apply `outline: 2px solid var(--ring)` with `outline-offset: 2px` to `a`, `button`, `input`, `select`, `textarea`, `[tabindex]` on `:focus-visible`
- **Do not** use `focus:outline-none` without providing `focus-visible:ring-2 focus-visible:ring-primary` or equivalent

### Contrast

- `--muted-foreground` (#a1a1aa) on `--background` (#000000) meets WCAG AA (~6.3:1)
- For text on `--muted` (#27272a) surfaces, consider `--muted-foreground-accessible` (#b4b4bc) for better readability

## Apple-Style Guidelines

- **Navigation icons (iOS 26)** — Prefer icons over text for navigation actions (Back, Close, Save). Use `aria-label` for accessibility on icon-only buttons and links.
- **No glow effects** — Avoid `drop-shadow`, `box-shadow` with colored rgba
- **Soft shadows** — Use neutral shadows: `0 2px 8px rgba(0,0,0,0.04)` (light) or `0 8px 24px rgba(0,0,0,0.2)` (dark)
- **Restrained hover** — Prefer `hover:opacity-90` or `hover:bg-muted/50` over scale or glow
- **Typography** — Lighter weights (500–600 for headings), refined letter-spacing
- **Glass components** — iOS 26 Liquid Glass: gradient background, light border, outer + inner shadow, backdrop blur (12–16px)

## Files

- `frontend/src/components/layout/AppLayout.tsx` — Main layout with floating tab bar
- `frontend/src/styles/fonts.css` — Geist (npm) import
- `frontend/src/styles/theme.css` — CSS variables and `@theme inline` for Tailwind
- `frontend/src/index.css` — Import order: fonts → theme → tailwindcss; base styles and typography in `@layer base`
- `frontend/src/components/ui/Skeleton.tsx` — Skeleton component
- `frontend/src/components/ui/EmptyState.tsx` — Empty state with optional onboarding steps
- `frontend/src/components/ui/utils.ts` — `cn()` utility
