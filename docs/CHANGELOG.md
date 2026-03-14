# Changelog

## iOS 26 Typography Update (2025-03)

### Summary

Updated typography to align with iOS 26 design guidelines: left alignment in alerts and onboarding, sentence case for section headers instead of ALL CAPS, and slightly increased text sizes.

### Changes

**Left alignment**
- EmptyState: `items-start text-left` instead of `items-center text-center`; progress bar `justify-start`
- LoadingScreen: left-aligned content in loading card
- UserProfileScreen: sign-in and error cards use `items-start text-left`

**Section headers — sentence case**
- BusinessMetrics: removed `uppercase tracking-wider` from metric labels
- WalletScreen: removed `uppercase` from rarity labels

**Text sizes**
- theme.css: `--font-size` 16px → 17px
- index.css: h1–h4, label, button, input sizes increased (~5%)

**Documentation**
- `docs/ux/design-system.md`: iOS 26 Typography section; updated Typography table; Empty State note on left alignment

### Files Modified

- `frontend/src/components/ui/EmptyState.tsx`
- `frontend/src/components/layout/LoadingScreen.tsx`
- `frontend/src/screens/settings/UserProfileScreen.tsx`
- `frontend/src/screens/demo/BusinessMetrics.tsx`
- `frontend/src/screens/wallet/WalletScreen.tsx`
- `frontend/src/styles/theme.css`
- `frontend/src/index.css`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Icons Instead of Text in Navigation (iOS 26) (2025-03)

### Summary

Replaced text labels with icons in the tab bar and navigation buttons (Back, Close, Save) to align with iOS 26 design preference for icon-only navigation.

### Changes

**AppLayout**
- Tab bar: removed text labels (Home, Robots, Store, Settings); icons only with `aria-label` for accessibility

**Back buttons**
- ControlScreen, MallGuideScreen, MallGuideCalibrationScreen, EventModeDemoScreen, UserProfileScreen: icon-only Back with `aria-label`
- ControlScreen error states: "Back to Robots" links replaced with icon-only

**Save button**
- MallGuideCalibrationScreen: "Сохранить" replaced with Save icon, `aria-label="Сохранить"`

**Stop button**
- MallGuideSimulationView: "← Stop" replaced with Square icon, `aria-label="Stop"`

**Documentation**
- `docs/ux/design-system.md`: Added iOS 26 navigation guideline under Apple-Style Guidelines

### Files Modified

- `frontend/src/components/layout/AppLayout.tsx`
- `frontend/src/screens/control/ControlScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideCalibrationScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideSimulationView.tsx`
- `frontend/src/screens/demo/EventModeDemoScreen.tsx`
- `frontend/src/screens/settings/UserProfileScreen.tsx`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Floating Tab Bar with iOS 26 Liquid Glass (2025-03)

### Summary

Transformed the bottom tab bar from edge-attached to a floating iOS 26-style bar with Liquid Glass effect, bottom inset, and rounded corners.

### Changes

**AppLayout**
- Tab bar: `position: fixed` with horizontal inset (`inset-x-4 sm:inset-x-6`), bottom gap (`12px + env(safe-area-inset-bottom)`)
- Applied `.glass-card` for Liquid Glass (gradient, border, shadows, backdrop blur 16px)
- Added `rounded-3xl` for rounded corners
- Main content: `pb-[var(--tab-bar-spacer)]` so scrollable content does not hide behind the bar

**theme.css**
- Added `--tab-bar-height` (64px), `--tab-bar-bottom-gap` (12px), `--tab-bar-spacer` variables

**Documentation**
- `docs/ux/design-system.md`: New Tab Bar section under Components; added AppLayout to Files list

### Files Modified

- `frontend/src/components/layout/AppLayout.tsx`
- `frontend/src/styles/theme.css`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## iOS 26 Increased Spacing (2025-03)

### Summary

Updated padding and gap values across the frontend to align with iOS 26 design guidelines: more space between elements for improved touch targets and visual breathing room.

### Changes

**Design system (docs/ux/design-system.md)**
- Card padding: `p-3 sm:p-4` → `p-4 sm:p-6`
- Grid gaps: `gap-3 sm:gap-4` → `gap-4 sm:gap-6`
- List internal padding: `p-4 sm:p-5` or `p-5 sm:p-6` for list rows

**Cards**
- StoreScreen: store item cards, loading skeleton
- MallGuideSimulationView: bottom bar overlay
- MallGuideCalibrationScreen: calibration cards, store list card
- MallGuideScreen: ready state card
- RobotsScreen: robot cards

**Grids**
- StoreScreen: store grid, modal specs list
- ControlScreen: Stop/Go Home button grid
- BusinessMetrics: metrics grid

**List internal padding**
- SettingsScreen: all list rows (User Profile, Theme, Calibration, Language)
- StoreScreen: modal specs list, action buttons
- EmptyState: step button padding
- MockActions: internal gap

**Internal card gaps**
- DashboardScreen: card content gaps
- ControlScreen: flex layout gaps
- MallGuideScreen: dropdown and store list gaps
- RobotsScreen: action button gaps

### Files Modified

- `docs/ux/design-system.md`
- `frontend/src/screens/store/StoreScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideSimulationView.tsx`
- `frontend/src/screens/mall-guide/MallGuideCalibrationScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideScreen.tsx`
- `frontend/src/screens/robots/RobotsScreen.tsx`
- `frontend/src/screens/control/ControlScreen.tsx`
- `frontend/src/screens/demo/BusinessMetrics.tsx`
- `frontend/src/screens/settings/SettingsScreen.tsx`
- `frontend/src/screens/dashboard/DashboardScreen.tsx`
- `frontend/src/components/ui/EmptyState.tsx`
- `frontend/src/components/wallet/MockActions.tsx`
- `docs/CHANGELOG.md`

---

## iOS 26 Rounded Corners (2025-03)

### Summary

Updated border radii across the design system to align with iOS 26 trends: larger radii for cards, buttons, and icon containers.

### Changes

**theme.css**
- `--radius`: 0.75rem → 1rem (base token)
- Derived tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`) recalculated via `calc()`

**Cards**
- `rounded-2xl` → `rounded-3xl` for all `glass-card` and `glass-card-elevated` surfaces

**Buttons and icon containers**
- `rounded-xl` → `rounded-2xl` for primary/secondary buttons, `glass-button-secondary`, `glass-icon-container`, and Skeleton placeholders

**Documentation**
- `docs/ux/design-system.md`: Radius section, Cards section, and Buttons section updated

### Files Modified

- `frontend/src/styles/theme.css`
- `frontend/src/screens/*` (Dashboard, Store, Wallet, Control, Mall Guide, Scripts, Settings, Robots, demo)
- `frontend/src/components/*` (layout, wallet, ui)
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## iOS 26 Liquid Glass Migration (2025-03)

### Summary

Updated glass components (`.glass-card`, `.glass-card-elevated`, `.glass-button-secondary`) from simple backdrop blur to iOS 26 Liquid Glass style with gradient backgrounds, light borders, and layered shadows.

### Changes

**theme.css**
- New Liquid Glass tokens: `--glass-bg-gradient`, `--glass-bg-elevated-gradient`, `--glass-border-liquid`, `--glass-shadow-outer`, `--glass-shadow-inner`
- Dark theme: gradient `rgba(255,255,255,0.15)` → `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.2)`, outer shadow `0 8px 24px rgba(0,0,0,0.2)`, inner shadow `inset 0 1px 0 rgba(255,255,255,0.2)`
- Light theme: adapted gradient and border values for light backgrounds

**index.css**
- `.glass-card`: gradient background, `--glass-border-liquid`, combined outer + inner shadow
- `.glass-card-elevated`: elevated gradient, same border and shadows
- `.glass-button-secondary`: gradient background, inner shadow only (no outer shadow to avoid visual clutter)

**Documentation**
- `docs/ux/design-system.md`: Cards section updated with Liquid Glass description; Apple-Style Guidelines updated

### Files Modified

- `frontend/src/styles/theme.css`
- `frontend/src/index.css`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Visual Hierarchy and Color Palette (2025-03)

### Summary

Extended visual hierarchy with hero gradients on all main screens, elevation levels for key cards, and expanded color palette with semantic colors, accent gradients, and status tokens.

### Changes

**Hero gradients**
- Added `from-primary/5` gradient overlay to MallGuideScreen, MallGuideCalibrationScreen, ControlScreen, ScriptsScreen, SettingsScreen, UserProfileScreen, WalletScreen (Dashboard, Store, Robots already had it)

**Elevation levels**
- `glass-card-elevated` for: robot cards when online (RobotsScreen), robot selection card (MallGuideScreen), main robot status card (ControlScreen), script cards with "Open" action (ScriptsScreen)

**Primary vs secondary actions**
- RobotsScreen: "Control" (primary, `bg-primary`) vs "Scripts" (secondary, `glass-button-secondary text-muted-foreground`)

**Semantic colors**
- New tokens: `--success`, `--warning`, `--info` (with foreground variants)
- Registered in `@theme inline` for Tailwind

**Accent gradient**
- `--gradient-accent`: linear-gradient(135deg, #007AFF, #5856D6)
- `.gradient-accent` utility class in `index.css` for hero accents and special CTAs

**Status semantics**
- New tokens: `--status-online`, `--status-offline`, `--status-busy`, `--status-error`, `--status-warning`
- Updated `getStatusColor` in RobotsScreen and ControlScreen to use status tokens
- MallGuideScreen execution status (running/completed/stopped/error) uses status tokens for consistency

**Documentation**
- Updated `docs/ux/design-system.md`: semantic colors table, accent gradient, status tokens, card elevation guidance, primary vs secondary action examples

### Files Modified

- `frontend/src/styles/theme.css`
- `frontend/src/index.css`
- `frontend/src/screens/mall-guide/MallGuideScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideCalibrationScreen.tsx`
- `frontend/src/screens/control/ControlScreen.tsx`
- `frontend/src/screens/scripts/ScriptsScreen.tsx`
- `frontend/src/screens/settings/SettingsScreen.tsx`
- `frontend/src/screens/settings/UserProfileScreen.tsx`
- `frontend/src/screens/wallet/WalletScreen.tsx`
- `frontend/src/screens/robots/RobotsScreen.tsx`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Empty States Enhancement (2025-03)

### Summary

Improved empty states with illustration, onboarding flow, and progress indicator for first-time users.

### Changes

**EmptyState component**
- New reusable `EmptyState` component in `frontend/src/components/ui/EmptyState.tsx`
- Supports icon, title, description, primary action (link or button)
- Optional onboarding steps with icons and completion state
- Horizontal progress bar (3 segments) for step completion
- Animated robot illustration (subtle float) when steps are shown
- Haptic feedback on step and action clicks

**Robots onboarding**
- "Подключите первого робота за 3 шага" — 3-step onboarding when robots list is empty
- Step 1: Browse Store (link to /store)
- Step 2: Order robot (link to /store; completed when user taps Order in Store)
- Step 3: Start control (automatic when robot appears in list)
- Progress persisted in `localStorage` via `useOnboardingProgress` hook
- After first robot is added, simplified empty state shown (no steps) for returning users with empty list

**StoreScreen**
- Marks onboarding step 1 completed on mount (user visited Store)
- Marks onboarding step 2 completed when user taps Order (grid or modal)

**Documentation**
- Updated `docs/ux/design-system.md` with Empty State section (usage, onboarding, illustration, progress)

### Files Modified/Created

- `frontend/src/components/ui/EmptyState.tsx` (new)
- `frontend/src/hooks/useOnboardingProgress.ts` (new)
- `frontend/src/screens/robots/RobotsScreen.tsx`
- `frontend/src/screens/store/StoreScreen.tsx`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Visual Hierarchy Improvements (2025-03)

### Summary

Improved visual hierarchy across the app with hero gradients, elevation levels for cards, and clearer primary vs secondary action separation.

### Changes

**Hero gradients**
- Dashboard, Store, and Robots screens: added `from-primary/5` gradient overlay to top sections (matching HeroSection pattern)
- Subtle depth without glow; `pointer-events-none` so interactions are unaffected

**Elevation levels**
- `glass-card-elevated` applied to important blocks: ProfileInfoCard, Event Mode Demo card, Robot Store card on Dashboard
- Standard `glass-card` retained for secondary content (Scripts, NFT, robot list items)

**Primary vs secondary actions**
- StoreScreen: split card actions into "Details" (secondary, `glass-button-secondary`) and "Order" (primary, `bg-primary`)
- Card content no longer opens modal; users tap "Details" explicitly
- Modal keeps single primary "Order" CTA

**Documentation**
- Updated `docs/ux/design-system.md` with visual hierarchy guidelines (hero gradients, elevation, primary/secondary buttons)

### Files Modified

- `frontend/src/screens/dashboard/DashboardScreen.tsx`
- `frontend/src/screens/store/StoreScreen.tsx`
- `frontend/src/screens/robots/RobotsScreen.tsx`
- `frontend/src/components/wallet/ProfileInfoCard.tsx`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Micro-animations and Feedback (2025-03)

### Summary

Added consistent micro-animations and visual feedback across the app using Framer Motion. Animations pair with existing haptic feedback for a cohesive tactile experience.

### Changes

**Screen transitions**
- Wrapped main `Outlet` in `AppLayout` with `AnimatePresence` and `motion.div` for smooth route changes
- Opacity fade (0.2s) on enter/exit using `location.key`

**Button tap feedback**
- Added `whileTap={{ scale: 0.98 }}` to buttons and interactive links across: RobotsScreen, StoreScreen, ControlScreen, SettingsScreen, ScriptsScreen, MallGuideScreen, MallGuideCalibrationScreen, MallGuideSimulationView, UserProfileScreen, ProfileInfoCard, TonWalletSection, AppLayout nav links

**Staggered list reveal**
- DashboardScreen: ProfileInfoCard and 4 link cards with staggered entrance
- RobotsScreen: Robot cards
- StoreScreen: Store grid items
- ScriptsScreen: Script cards per section
- SettingsScreen: Settings rows with lighter stagger

**Modal animation**
- StoreScreen product detail modal: AnimatePresence with backdrop fade and sheet slide-up from bottom

**Documentation**
- Updated `docs/ux/design-system.md` with animation guidelines (whileTap, staggered reveal, AnimatePresence, modal patterns, haptic pairing)

### Files Modified

- `frontend/src/components/layout/AppLayout.tsx`
- `frontend/src/screens/dashboard/DashboardScreen.tsx`
- `frontend/src/screens/robots/RobotsScreen.tsx`
- `frontend/src/screens/store/StoreScreen.tsx`
- `frontend/src/screens/control/ControlScreen.tsx`
- `frontend/src/screens/settings/SettingsScreen.tsx`
- `frontend/src/screens/settings/UserProfileScreen.tsx`
- `frontend/src/screens/scripts/ScriptsScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideCalibrationScreen.tsx`
- `frontend/src/screens/mall-guide/MallGuideSimulationView.tsx`
- `frontend/src/components/wallet/ProfileInfoCard.tsx`
- `frontend/src/components/wallet/TonWalletSection.tsx`
- `docs/ux/design-system.md`
- `docs/CHANGELOG.md`

---

## Loading State with Glassmorphism (2025-03)

### Summary

Replaced the plain "Loading..." text during Telegram auth initialization with a glassmorphism-styled loading screen. The new loading state uses a glass card, Bot icon with pulse animation, shimmer skeleton bars, and design tokens for consistency with the app's design system.

### Changes

**Loading Screen**
- Added `LoadingScreen` component with glass card container (`glass-card rounded-2xl`)
- Bot icon in `glass-icon-container` with `animate-pulse` for visual feedback
- Shimmer skeleton bars below the icon for structure preview
- "Loading..." label using `text-muted-foreground` (no hardcoded colors)

**Animations**
- Added `@keyframes shimmer` and `.shimmer-loading` utility in `index.css` for reusable shimmer effect

**App**
- Replaced inline loading markup in `AppContent` with `<LoadingScreen />`

### Files Modified

- `frontend/src/index.css` — shimmer keyframes and utility class
- `frontend/src/components/layout/LoadingScreen.tsx` — new component
- `frontend/src/App.tsx` — use LoadingScreen when auth is not ready

---

## NFT Card Icon Semantics (2025-03)

### Summary

Replaced the NFT card icon on the Dashboard with a more semantic icon to improve clarity for users.

### Changes

**Dashboard (Home)**
- NFT card: replaced `ImageIcon` with `Gem` — better conveys collectible/premium assets and NFT collection
- Icon semantics: Gem aligns with NFT/collectibles context; Wallet and Coins remain alternatives for wallet-focused flows

### Files Modified

- `frontend/src/screens/dashboard/DashboardScreen.tsx`

---

## Bottom Navigation Redesign (2025-03)

### Summary

Reduced the tab bar from 6 to 4 items to improve mobile UX. NFT and Scripts are now reached via cards on the Home dashboard instead of dedicated tabs.

### Changes

**Tab Bar**
- Removed NFT and Scripts from the bottom navigation
- Tab bar now shows: Home | Robots | Store | Settings

**Dashboard (Home)**
- Added Scripts card — links to `/scripts` (browse and run scenarios)
- Added NFT card — links to `/wallet` (NFT collection)
- Card order: ProfileInfoCard, Event Mode Demo, Store, Scripts, NFT

**Routes**
- `/wallet` and `/scripts` routes unchanged; reachable from Home cards or deep links
- When on Wallet or Scripts, user returns via Back Button or by tapping Home tab

### Files Modified

- `frontend/src/components/layout/AppLayout.tsx`
- `frontend/src/screens/dashboard/DashboardScreen.tsx`
- `docs/ux/screen-map.md`
- `docs/architecture/frontend-architecture.md`

---

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
