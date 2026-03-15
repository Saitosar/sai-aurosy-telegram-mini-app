/**
 * Robot DTOs - shared between frontend and backend.
 * Aligned with docs/architecture/data-model.md and docs/api/api-overview.md
 */

export type RobotStatus = "online" | "offline" | "busy" | "error";

export interface Robot {
  id: string;
  name: string;
  model: string;
  status: RobotStatus;
  scenario?: string;
  battery?: number; // 0–100
  warnings?: string[]; // platform warnings
}

export interface RobotDetail extends Robot {
  position?: { x: number; y: number };
}

export interface RobotCommandRequest {
  command: string;
  params?: Record<string, unknown>;
}

/** Known robot command types for manual control and basic operations */
export type RobotCommandType =
  | "release_control"
  | "safe_stop"
  | "go_home"
  | "move"
  | "walk"
  | "run"
  | "posture"
  | "head_rotate"
  | "waist_rotate";

/** Param schemas for commands (documented for API consumers) */
export interface MoveCommandParams {
  direction?: number; // degrees 0-360 (0=forward, 90=right)
  speed?: number; // 0-1
}

export interface RotateCommandParams {
  direction?: "left" | "right";
  amount?: number;
}
