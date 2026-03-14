import {
  DEFAULT_RECEPTION,
  DEFAULT_STORES,
  type StorePosition,
} from "./cityMallStores";

export const STORAGE_KEY = "city-mall-stores";

export type PathMode = "waypoints" | "wayGraph";

export interface PathSegment {
  from: StorePosition;
  to: StorePosition;
}

export interface StoredCalibration {
  reception: StorePosition;
  stores: Record<string, StorePosition>;
  pathMode?: PathMode;
  routes?: Record<string, StorePosition[]>;
  pathSegments?: PathSegment[];
}

function isValidPosition(p: unknown): p is StorePosition {
  return (
    p !== null &&
    typeof p === "object" &&
    typeof (p as StorePosition).left === "number" &&
    typeof (p as StorePosition).top === "number"
  );
}

function isValidPathSegment(s: unknown): s is PathSegment {
  return (
    s !== null &&
    typeof s === "object" &&
    isValidPosition((s as PathSegment).from) &&
    isValidPosition((s as PathSegment).to)
  );
}

export function loadStores(): StoredCalibration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCalibration;
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.reception &&
      typeof parsed.reception.left === "number" &&
      typeof parsed.reception.top === "number" &&
      parsed.stores &&
      typeof parsed.stores === "object"
    ) {
      const result: StoredCalibration = {
        reception: parsed.reception,
        stores: parsed.stores,
      };
      if (parsed.pathMode === "waypoints" || parsed.pathMode === "wayGraph") {
        result.pathMode = parsed.pathMode;
      }
      if (
        parsed.routes &&
        typeof parsed.routes === "object" &&
        Array.isArray(parsed.routes) === false
      ) {
        const routes: Record<string, StorePosition[]> = {};
        for (const [k, v] of Object.entries(parsed.routes)) {
          if (Array.isArray(v) && v.every(isValidPosition)) {
            routes[k] = v;
          }
        }
        result.routes = routes;
      }
      if (Array.isArray(parsed.pathSegments)) {
        result.pathSegments = parsed.pathSegments.filter(isValidPathSegment);
      }
      return result;
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveStores(data: StoredCalibration): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDefaultCalibration(): StoredCalibration {
  return {
    reception: { ...DEFAULT_RECEPTION },
    stores: Object.fromEntries(
      Object.entries(DEFAULT_STORES).map(([k, v]) => [k, { ...v }])
    ),
    routes: {},
    pathSegments: [],
  };
}

/** Clears all stores, routes, path segments. Reception set to center for recalibration. */
export function getEmptyCalibration(): StoredCalibration {
  return {
    reception: { left: 50, top: 50 },
    stores: {},
    routes: {},
    pathSegments: [],
  };
}
