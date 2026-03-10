/**
 * Scenario DTOs - shared between frontend and backend.
 * Aligned with docs/architecture/data-model.md and docs/api/api-overview.md
 */

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface RunScenarioRequest {
  robotId: string;
}

export interface ScenarioExecution {
  id: string;
  scenarioId: string;
  robotId: string;
  status: "running" | "completed" | "stopped" | "error";
  progress?: number;
  currentWaypoint?: number;
  totalWaypoints?: number;
}
