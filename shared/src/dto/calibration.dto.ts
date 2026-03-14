/**
 * Mall Guide calibration DTOs — shared between frontend and backend.
 * Percent-based coordinates on floor plan: left 0–100, top 0–100.
 */

export interface StorePosition {
  left: number;
  top: number;
}

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
