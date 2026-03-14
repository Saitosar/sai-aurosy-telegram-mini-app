import { Injectable } from "@nestjs/common";
import { join } from "path";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import type { StoredCalibration, StorePosition } from "shared";

const DATA_DIR = "data";
const FILE_NAME = "city-mall-stores.json";

/** Default store positions — matches frontend cityMallStores.ts */
const DEFAULT_STORES: Record<string, StorePosition> = {
  Bershka: { left: 10, top: 78 },
  "Pull&Bear": { left: 14, top: 75 },
  Bloom: { left: 18, top: 78 },
  "New Yorker": { left: 22, top: 78 },
  ADL: { left: 26, top: 78 },
  "Kiko Milano": { left: 14, top: 65 },
  "Parfum Gallery": { left: 18, top: 62 },
  "Zara Men": { left: 12, top: 52 },
  Zara: { left: 10, top: 56 },
  Mango: { left: 38, top: 60 },
  Stradivarius: { left: 34, top: 58 },
  Elemis: { left: 44, top: 54 },
  "L'Occitane": { left: 48, top: 54 },
  "2D Skin Health": { left: 52, top: 54 },
  MAC: { left: 50, top: 48 },
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

function getDefaultCalibration(): StoredCalibration {
  return {
    reception: { left: 22, top: 48 },
    stores: Object.fromEntries(
      Object.entries(DEFAULT_STORES).map(([k, v]) => [k, { ...v }])
    ),
    routes: {},
    pathSegments: [],
  };
}

function isValidPosition(p: unknown): p is StorePosition {
  return (
    p !== null &&
    typeof p === "object" &&
    typeof (p as StorePosition).left === "number" &&
    typeof (p as StorePosition).top === "number"
  );
}

function isValidCalibration(raw: unknown): raw is StoredCalibration {
  if (
    !raw ||
    typeof raw !== "object" ||
    !(raw as StoredCalibration).reception ||
    !(raw as StoredCalibration).stores
  ) {
    return false;
  }
  const r = raw as StoredCalibration;
  if (!isValidPosition(r.reception)) return false;
  if (typeof r.stores !== "object" || Array.isArray(r.stores)) return false;
  for (const v of Object.values(r.stores)) {
    if (!isValidPosition(v)) return false;
  }
  if (r.pathMode && r.pathMode !== "waypoints" && r.pathMode !== "wayGraph") {
    return false;
  }
  if (r.routes && (typeof r.routes !== "object" || Array.isArray(r.routes))) {
    return false;
  }
  if (r.pathSegments && !Array.isArray(r.pathSegments)) return false;
  return true;
}

function sanitizeCalibration(raw: unknown): StoredCalibration {
  if (!isValidCalibration(raw)) {
    throw new Error("Invalid calibration data");
  }
  const r = raw as StoredCalibration;
  const result: StoredCalibration = {
    reception: { ...r.reception },
    stores: Object.fromEntries(
      Object.entries(r.stores).map(([k, v]) => [k, { ...v }])
    ),
  };
  if (r.pathMode === "waypoints" || r.pathMode === "wayGraph") {
    result.pathMode = r.pathMode;
  }
  if (r.routes && typeof r.routes === "object" && !Array.isArray(r.routes)) {
    const routes: Record<string, StorePosition[]> = {};
    for (const [k, v] of Object.entries(r.routes)) {
      if (Array.isArray(v) && v.every(isValidPosition)) {
        routes[k] = v.map((p) => ({ ...p }));
      }
    }
    result.routes = routes;
  } else {
    result.routes = {};
  }
  if (Array.isArray(r.pathSegments)) {
    result.pathSegments = r.pathSegments
      .filter(
        (s) =>
          s &&
          typeof s === "object" &&
          isValidPosition(s.from) &&
          isValidPosition(s.to)
      )
      .map((s) => ({ from: { ...s.from }, to: { ...s.to } }));
  } else {
    result.pathSegments = [];
  }
  return result;
}

@Injectable()
export class CalibrationService {
  private getFilePath(): string {
    return join(process.cwd(), DATA_DIR, FILE_NAME);
  }

  async getCalibration(): Promise<{
    data: StoredCalibration;
    persisted: boolean;
  }> {
    const filePath = this.getFilePath();
    try {
      await stat(filePath);
    } catch {
      return { data: getDefaultCalibration(), persisted: false };
    }
    const raw = await readFile(filePath, "utf-8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { data: getDefaultCalibration(), persisted: false };
    }
    if (!isValidCalibration(parsed)) {
      return { data: getDefaultCalibration(), persisted: false };
    }
    return { data: sanitizeCalibration(parsed), persisted: true };
  }

  async saveCalibration(data: StoredCalibration): Promise<void> {
    const sanitized = sanitizeCalibration(data);
    const filePath = this.getFilePath();
    const dir = join(process.cwd(), DATA_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, JSON.stringify(sanitized, null, 2), "utf-8");
  }
}
