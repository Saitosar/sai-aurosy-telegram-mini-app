# Store Screen

## User Goal

Browse the robot catalog and acquire robots to add to the user's fleet. View details before acquiring.

## Screen Location

- **Route:** `/store`
- **Access:** From Dashboard (tab/menu)

## Actions

| Action | Description | Outcome |
|--------|-------------|---------|
| Browse catalog | View available robots | Grid or list of store items |
| Filter | Filter by type, model (TBD) | Filtered list |
| View details | Open item detail modal | Modal overlay (no separate route) |
| **Order** (primary) | Open Telegram chat with sales contact | Chat with @Arif_Mammadov1; pre-filled message |
| **Acquire** (secondary) | Add robot to fleet | In modal; robot added; confirmation shown |

## Layout

- **Grid or list** — Store items (robots) with:
  - Image (or placeholder icon)
  - Model tag (badge) — shown under image, above name
  - Name, short description (1-line clamp)
  - **Order** CTA button — primary action; opens Telegram chat with sales contact (@Arif_Mammadov1), includes item name in pre-filled message
- **Card interactions** — Two distinct actions:
  - Tap image/name/description → opens detail modal
  - Tap Order → opens Telegram chat directly (no modal)
- **Detail modal** — Modal overlay (no separate route); full description, specs, compatibility, product image, model tag, Order button, Acquire button
- **Empty/loading states** — Skeleton or placeholder while loading

## Expected Outcomes

- User sees catalog of robots available for acquisition
- User can view details before acquiring
- User can acquire a robot; it appears in Robots screen
- Acquisition may require platform eligibility (e.g., subscription); errors shown clearly

## Store Catalog (Mock Data)

The store displays robots from mock data. As of the latest update, the catalog includes:

- **AGIBOT A2** — Service & Interaction Robot
- **AGIBOT A2-W** — Mobile Service Robot (malls, museums, exhibition spaces)
- **AGIBOT X2** — Human-Interaction Robot
- **AGIBOT G2** — Humanoid Service Robot
- **AGIBOT C5** — Autonomous Cleaning Robot (malls, airports, offices, commercial facilities)
- **AGIBOT D1** — Autonomous Delivery Robot (indoor delivery: hotels, offices, hospitals, malls)

## Wireframe (Conceptual)

```
+---------------------------+
| Robot Store               |
+---------------------------+
| [Robot A]  [Robot B]      |
| Model X    Model Y       |
| [Order]    [Order]       |
+---------------------------+
| [Robot C]  [Robot D]      |
| Model Z    Model W       |
| [Order]    [Order]       |
+---------------------------+
| [Home] [Robots] [Store] [TON] [Scripts] [Settings] |
+---------------------------+
```

**Detail view (modal or full screen):**
- Product image, name, model tag, description
- Specs, compatibility
- [Order] button — opens Telegram chat with @Arif_Mammadov1 (pre-filled with item name)
- [Acquire Robot] button
- [Back] to catalog
