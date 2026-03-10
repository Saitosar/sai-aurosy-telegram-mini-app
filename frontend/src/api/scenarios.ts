import { apiFetch } from "./client";
import type { Scenario, ScenarioExecution, RunScenarioRequest } from "shared";

export async function getScenarios(): Promise<Scenario[]> {
  return apiFetch<Scenario[]>("/scenarios");
}

export async function getScenario(id: string): Promise<Scenario> {
  return apiFetch<Scenario>(`/scenarios/${id}`);
}

export async function runScenario(scenarioId: string, data: RunScenarioRequest): Promise<ScenarioExecution> {
  return apiFetch<ScenarioExecution>(`/scenarios/${scenarioId}/run`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getExecutionStatus(
  scenarioId: string,
  executionId: string
): Promise<ScenarioExecution> {
  return apiFetch<ScenarioExecution>(`/scenarios/${scenarioId}/executions/${executionId}`);
}

export async function stopExecution(
  scenarioId: string,
  executionId: string
): Promise<void> {
  await apiFetch(`/scenarios/${scenarioId}/executions/${executionId}/stop`, {
    method: "POST",
  });
}
