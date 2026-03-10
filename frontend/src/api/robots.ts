import { apiFetch } from "./client";
import type { Robot, RobotDetail, RobotCommandRequest } from "shared";

export async function getRobots(): Promise<Robot[]> {
  return apiFetch<Robot[]>("/robots");
}

export async function getRobot(id: string): Promise<RobotDetail> {
  return apiFetch<RobotDetail>(`/robots/${id}`);
}

export async function sendCommand(
  robotId: string,
  command: RobotCommandRequest
): Promise<void> {
  await apiFetch(`/robots/${robotId}/commands`, {
    method: "POST",
    body: JSON.stringify(command),
  });
}
