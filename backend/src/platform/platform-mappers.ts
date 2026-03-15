/**
 * Platform response mappers.
 * Normalizes SAI AUROSY platform responses to Mini App shared DTOs.
 * TODO: adjust when platform OpenAPI schema is available.
 */

import type {
  Robot,
  RobotDetail,
  Scenario,
  ScenarioExecution,
  StoreItem,
  Telemetry,
} from "shared";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") return parseInt(v, 10) || 0;
  return 0;
}

function obj<T>(v: unknown, fn: (x: Record<string, unknown>) => T): T {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return fn(v as Record<string, unknown>);
  }
  return fn({});
}

export function mapRobot(raw: unknown): Robot {
  return obj(raw, (o) => ({
    id: str(o.id ?? o.robot_id),
    name: str(o.name ?? "Unknown"),
    model: str(o.model ?? ""),
    status: (str(o.status) as Robot["status"]) || "offline",
    scenario: o.scenario ? str(o.scenario) : undefined,
    battery: typeof o.battery === "number" ? o.battery : undefined,
    warnings: Array.isArray(o.warnings)
      ? (o.warnings as unknown[]).map((w) => str(w)).filter(Boolean)
      : undefined,
  }));
}

export function mapRobotDetail(raw: unknown): RobotDetail {
  const robot = mapRobot(raw);
  return obj(raw, (o) => {
    const position = o.position as { x?: number; y?: number } | undefined;
    return {
      ...robot,
      position:
        position && typeof position.x === "number" && typeof position.y === "number"
          ? { x: position.x, y: position.y }
          : undefined,
    };
  });
}

export function mapScenario(raw: unknown): Scenario {
  return obj(raw, (o) => ({
    id: str(o.id),
    name: str(o.name ?? "Unknown"),
    description: str(o.description ?? ""),
    type: str(o.type ?? o.id ?? ""),
  }));
}

const TASK_STATUS_MAP: Record<string, ScenarioExecution["status"]> = {
  pending: "running",
  running: "running",
  completed: "completed",
  cancelled: "stopped",
  failed: "error",
};

export function mapTaskToScenarioExecution(
  raw: unknown,
  scenarioId: string
): ScenarioExecution {
  return obj(raw, (o) => {
    const statusStr = str(o.status).toLowerCase();
    const status = TASK_STATUS_MAP[statusStr] ?? "running";
    return {
      id: str(o.id),
      scenarioId,
      robotId: str(o.robot_id ?? o.robotId),
      status,
      progress: num(o.progress),
      currentWaypoint: num(o.current_waypoint ?? o.currentWaypoint),
      totalWaypoints: num(o.total_waypoints ?? o.totalWaypoints),
    };
  });
}

function mapTemperature(v: unknown): Telemetry["temperature"] {
  const t = v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
  if (!t) return undefined;
  const casing = t.casing != null ? num(t.casing) : undefined;
  const winding = t.winding != null ? num(t.winding) : undefined;
  if (casing === undefined && winding === undefined) return undefined;
  return { casing, winding };
}

export function mapTelemetry(raw: unknown, robotId: string): Telemetry {
  return obj(raw, (o) => {
    const position = o.position as { x?: number; y?: number } | undefined;
    const commQuality = o.communication_quality ?? o.communicationQuality;
    const alarmsRaw = o.alarms;
    const alarms = Array.isArray(alarmsRaw)
      ? (alarmsRaw as unknown[]).map((a) => str(a)).filter(Boolean)
      : undefined;
    return {
      robotId,
      timestamp: str(o.timestamp) || new Date().toISOString(),
      status: str(o.status) || "unknown",
      position:
        position && typeof position.x === "number" && typeof position.y === "number"
          ? { x: position.x, y: position.y }
          : undefined,
      battery: typeof o.battery === "number" ? o.battery : undefined,
      sensorData:
        o.sensorData && typeof o.sensorData === "object"
          ? (o.sensorData as Record<string, unknown>)
          : undefined,
      temperature: mapTemperature(o.temperature),
      communicationQuality: commQuality != null ? num(commQuality) : undefined,
      alarms: alarms?.length ? alarms : undefined,
    };
  });
}

export function mapStoreItem(raw: unknown): StoreItem {
  return obj(raw, (o) => ({
    id: str(o.id),
    type: (str(o.type) as StoreItem["type"]) || "robot",
    name: str(o.name ?? "Unknown"),
    model: o.model ? str(o.model) : undefined,
    description: str(o.description ?? ""),
    specs: Array.isArray(o.specs) ? o.specs.map((s: unknown) => str(s)) : undefined,
    price: o.price ? str(o.price) : undefined,
  }));
}
