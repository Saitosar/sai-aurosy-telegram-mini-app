/**
 * City Mall store locations (percent-based coordinates on floor plan).
 *
 * COORDINATE SYSTEM:
 * - left: 0 = left edge of image, 100 = right edge
 * - top: 0 = top edge of image, 100 = bottom edge
 *
 * TO CALIBRATE: Open city-mall-floorplan.png, find a store's center,
 * estimate (left%, top%). Update the value below.
 * Example: Zara in bottom-left corner → left ~10, top ~80
 */

export const RECEPTION = { left: 22, top: 48 } as const;
export const DEFAULT_RECEPTION = { ...RECEPTION };

export interface StorePosition {
  left: number;
  top: number;
}

/** Store positions — left/right/top/bottom match the floor plan layout */
export const CITY_MALL_STORES: Record<string, StorePosition> = {
  // Left side (left 8–28)
  Bershka: { left: 10, top: 78 },
  "Pull&Bear": { left: 14, top: 75 },
  Bloom: { left: 18, top: 78 },
  "New Yorker": { left: 22, top: 78 },
  ADL: { left: 26, top: 78 },
  "Kiko Milano": { left: 14, top: 65 },
  "Parfum Gallery": { left: 18, top: 62 },
  "Zara Men": { left: 12, top: 52 },
  Zara: { left: 10, top: 56 },
  // Center-left
  Mango: { left: 38, top: 60 },
  Stradivarius: { left: 34, top: 58 },
  Elemis: { left: 44, top: 54 },
  "L'Occitane": { left: 48, top: 54 },
  "2D Skin Health": { left: 52, top: 54 },
  MAC: { left: 50, top: 48 },
  // Center
  "Dildora Kasymova": { left: 52, top: 50 },
  Tanuki: { left: 58, top: 28 },
  "7Gardens": { left: 56, top: 48 },
  Tumi: { left: 60, top: 42 },
  "Gerry Weber": { left: 64, top: 48 },
  Diesel: { left: 68, top: 44 },
  Maje: { left: 72, top: 48 },
  Sandro: { left: 70, top: 52 },
  "Marina Rinaldi": { left: 76, top: 50 },
  "Luisa Spagnoli": { left: 80, top: 48 },
  Oysho: { left: 62, top: 58 },
  Pinko: { left: 70, top: 58 },
  Peserico: { left: 74, top: 58 },
  "Zadig & Voltaire": { left: 78, top: 58 },
  Twinset: { left: 82, top: 58 },
  "Saadi Couture": { left: 86, top: 58 },
  Piquadro: { left: 90, top: 58 },
  Hugo: { left: 68, top: 66 },
  "Weekend Max Mara": { left: 72, top: 66 },
  // Right side
  Paul: { left: 54, top: 22 },
  Furla: { left: 66, top: 38 },
  Constella: { left: 70, top: 40 },
  "12 Storeez": { left: 74, top: 38 },
  "J.Steffany": { left: 78, top: 40 },
  "Ghanbarinia Carpets": { left: 82, top: 38 },
  Boss: { left: 86, top: 40 },
  Premier: { left: 90, top: 38 },
  Mestika: { left: 94, top: 40 },
  "Zara Home": { left: 92, top: 32 },
  "Massimo Dutti": { left: 88, top: 28 },
  "Art Media": { left: 95, top: 28 },
};

export const DEFAULT_STORES = { ...CITY_MALL_STORES };
const STORE_NAMES = Object.keys(CITY_MALL_STORES);

/**
 * Find a store by user query. Uses normalized matching:
 * - trim, lowercase
 * - exact match first
 * - then includes match (e.g. "zara" -> Zara, Zara Men)
 */
export function findStore(query: string): string | null {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return null;

  for (const name of STORE_NAMES) {
    if (name.toLowerCase() === q) return name;
  }

  for (const name of STORE_NAMES) {
    if (name.toLowerCase().includes(q)) return name;
  }

  for (const name of STORE_NAMES) {
    if (q.includes(name.toLowerCase())) return name;
  }

  return null;
}

export function getStorePosition(storeName: string): StorePosition | null {
  return CITY_MALL_STORES[storeName] ?? null;
}
