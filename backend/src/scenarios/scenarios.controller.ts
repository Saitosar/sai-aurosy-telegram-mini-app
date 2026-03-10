import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type {
  Scenario,
  ScenarioExecution,
  RunScenarioRequest,
} from "shared";
import { AuditService } from "../audit/audit.service";
import { ConditionalAuthGuard } from "../auth/auth.guard";
import {
  mapScenario,
  mapTaskToScenarioExecution,
} from "../platform/platform-mappers";
import { PlatformClientService } from "../platform/platform-client.service";

/**
 * Fallback when PLATFORM_API_URL is unset. Scripts come from the platform;
 * this mock is for local dev only. See docs/architecture/platform-reference.md.
 */
const MOCK_SCENARIOS: Scenario[] = [
  {
    id: "mall-guide",
    name: "Mall Guide",
    description: "Guide customers through the mall with predefined waypoints.",
    type: "behavioral",
  },
];

const executions = new Map<string, ScenarioExecution>();

function authHeaders(authorization?: string): Record<string, string> {
  return authorization ? { Authorization: authorization } : {};
}

@Controller("scenarios")
@UseGuards(ConditionalAuthGuard)
export class ScenariosController {
  constructor(
    private readonly platform: PlatformClientService,
    private readonly audit: AuditService
  ) {}

  @Get()
  async list(
    @Headers("authorization") authorization?: string
  ): Promise<Scenario[]> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<unknown>(
        "/scenarios",
        "GET",
        undefined,
        authHeaders(authorization)
      );
      const arr = Array.isArray(data) ? data : [];
      return arr.map((item) => mapScenario(item));
    }
    return MOCK_SCENARIOS;
  }

  @Get(":id")
  async get(
    @Param("id") id: string,
    @Headers("authorization") authorization?: string
  ): Promise<Scenario> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<unknown>(
        `/scenarios/${id}`,
        "GET",
        undefined,
        authHeaders(authorization)
      );
      return mapScenario(data);
    }
    const s = MOCK_SCENARIOS.find((x) => x.id === id);
    if (!s) throw new NotFoundException("Scenario not found");
    return s;
  }

  @Post(":id/run")
  async run(
    @Param("id") id: string,
    @Body() body: RunScenarioRequest,
    @Headers("authorization") authorization?: string
  ): Promise<ScenarioExecution> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      // SAI AUROSY uses Tasks API: POST /tasks with robot_id, scenario_id
      const { data } = await this.platform.forward<unknown>(
        "/tasks",
        "POST",
        {
          robot_id: body.robotId,
          scenario_id: id,
          payload: {},
        },
        authHeaders(authorization)
      );
      const exec = mapTaskToScenarioExecution(data, id);
      this.audit.logScenarioRun(id, body.robotId, exec.id);
      return exec;
    }
    const exec: ScenarioExecution = {
      id: `exec-${Date.now()}`,
      scenarioId: id,
      robotId: body.robotId,
      status: "running",
      progress: 0,
      currentWaypoint: 1,
      totalWaypoints: 5,
    };
    executions.set(exec.id, exec);
    this.audit.logScenarioRun(id, body.robotId, exec.id);
    return exec;
  }

  @Get(":id/executions/:executionId")
  async getExecution(
    @Param("id") id: string,
    @Param("executionId") executionId: string,
    @Headers("authorization") authorization?: string
  ): Promise<ScenarioExecution> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      // SAI AUROSY: executionId = task id
      const { data } = await this.platform.forward<unknown>(
        `/tasks/${executionId}`,
        "GET",
        undefined,
        authHeaders(authorization)
      );
      return mapTaskToScenarioExecution(data, id);
    }
    const exec = executions.get(executionId);
    if (!exec) throw new NotFoundException("Execution not found");
    return exec;
  }

  @Post(":id/executions/:executionId/stop")
  async stopExecution(
    @Param("id") id: string,
    @Param("executionId") executionId: string,
    @Headers("authorization") authorization?: string
  ): Promise<void> {
    this.audit.logScenarioStop(id, executionId);
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      // SAI AUROSY: POST /tasks/:id/cancel
      await this.platform.forward(
        `/tasks/${executionId}/cancel`,
        "POST",
        undefined,
        authHeaders(authorization)
      );
      return;
    }
    const exec = executions.get(executionId);
    if (exec) exec.status = "stopped";
  }
}
