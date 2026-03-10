/**
 * Telemetry DTOs - shared between frontend and backend.
 * Aligned with docs/architecture/data-model.md and docs/api/api-overview.md
 */

export interface Telemetry {
  robotId: string;
  timestamp: string;
  status: string;
  position?: { x: number; y: number };
  battery?: number;
  sensorData?: Record<string, unknown>;
}
