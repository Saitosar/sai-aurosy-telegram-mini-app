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
| View details | Open item detail view | Modal or detail screen |
| Order | Open Telegram chat with sales contact | Chat with @Arif_Mammadov1 |
| Acquire | Add robot to fleet | Robot added; confirmation shown |

## Layout

- **Grid or list** — Store items (robots) with image (or placeholder icon), name, short description (2-line clamp)
- **Detail modal/screen** — Full description, specs, compatibility, product image
- **Order button** — Primary CTA; opens Telegram chat with sales contact (@Arif_Mammadov1)
- **Acquire button** — Secondary CTA to add robot to fleet
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
+---------------------------+
| [Robot C]  [Robot D]      |
| Model Z    Model W       |
+---------------------------+
|                           |
| [Dashboard] [Robots] [Mall]|
+---------------------------+
```

**Detail view (modal or full screen):**
- Product image, name, description
- Specs, compatibility
- [Order] button — opens Telegram chat with @Arif_Mammadov1
- [Acquire Robot] button
- [Back] to catalog
