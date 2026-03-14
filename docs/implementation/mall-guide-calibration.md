# Mall Guide — Calibration of Store Coordinates

## How It Works

The robot navigates using **percent-based coordinates** on the floor plan image:

- **left**: 0 = left edge, 100 = right edge
- **top**: 0 = top edge, 100 = bottom edge

Each store has `{ left, top }`. The robot moves from Reception to the store and back. Use the **Calibration** screen (`/scripts/mall-guide/calibration`) to set positions interactively.

## Visual Markers

- **"Показать все магазины"** — shows markers for all stores on the map
- **Target store** — highlighted in green when guiding
- **Reception** — cyan dot (starting point)

If a marker does not match the store on the floor plan, adjust coordinates in Calibration.

## Path Modes

The robot can follow defined routes instead of straight lines. Two modes are available:

### Waypoints

Per-store routes: Reception → waypoint1 → waypoint2 → … → store.

1. Open Calibration → **Waypoints** tab
2. Select a store from the dropdown
3. Click on the map to add waypoints (in order from Reception to the store)
4. Path is drawn with arrows; use "Очистить маршрут" to reset

### Way Graph

Shared path segments (corridors) that form a graph. A* finds the shortest path.

1. Open Calibration → **Way Graph** tab
2. Click on the map for the start of a segment, then click again for the end
3. Segments are bidirectional; reception and stores must be within ~10% of a segment endpoint
4. Use "Очистить все сегменты" to reset

### Path Mode Selector

In Calibration, the "Режим пути в симуляции" toggle chooses which mode the simulation uses: **Waypoints** or **Way Graph**. If no path is defined, the robot falls back to a straight line.

## JSON Schema (Export/Import)

```json
{
  "reception": { "left": 22, "top": 48 },
  "stores": {
    "Zara": { "left": 10, "top": 56 }
  },
  "pathMode": "waypoints",
  "routes": {
    "Zara": [
      { "left": 30, "top": 50 },
      { "left": 20, "top": 55 }
    ]
  },
  "pathSegments": [
    { "from": { "left": 22, "top": 48 }, "to": { "left": 30, "top": 50 } }
  ]
}
```

- **pathMode**: `"waypoints"` or `"wayGraph"` — which pathfinding to use
- **routes**: Store name → array of waypoints (between reception and store)
- **pathSegments**: Array of `{ from, to }` edges for the Way Graph

## How to Calibrate (Interactive)

1. Go to Mall Guide → **Калибровка карты**
2. **Магазин** mode: Enter store name, click map for position, Save
3. **Reception** mode: Click map to set reception desk position
4. **Waypoints** or **Way Graph**: Define paths (see Path Modes above)
5. Export JSON for backup; Import to restore

## Manual Calibration (Code)

For defaults in `cityMallStores.ts`:

1. Open `frontend/public/city-mall-floorplan.png` in an image editor
2. For each store, estimate `left` and `top` as percentages
3. Update `CITY_MALL_STORES` in `frontend/src/screens/mall-guide/cityMallStores.ts`

## Quick Reference

| Position on map | left range | top range |
|-----------------|------------|-----------|
| Left column     | 8–28       | varies    |
| Center          | 35–70      | varies    |
| Right column    | 72–95      | varies    |
| Top (entrance)  | varies     | 15–30     |
| Bottom          | varies     | 70–85     |

## Adding a New Store

1. In Calibration → **Магазин** mode: enter name, click map, Save
2. Or add to `CITY_MALL_STORES` in `cityMallStores.ts` for defaults
