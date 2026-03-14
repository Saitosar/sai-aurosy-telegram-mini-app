import { apiFetch } from "./client";
import type { StoredCalibration } from "shared";

export interface CalibrationResponse {
  data: StoredCalibration;
  persisted: boolean;
}

export async function getCalibration(): Promise<CalibrationResponse> {
  return apiFetch<CalibrationResponse>("/mall-guide/calibration");
}

export async function putCalibration(data: StoredCalibration): Promise<void> {
  await apiFetch("/mall-guide/calibration", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
