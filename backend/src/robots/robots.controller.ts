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
import type { Robot, RobotDetail, RobotCommandRequest } from "shared";
import { AuditService } from "../audit/audit.service";
import { ConditionalAuthGuard } from "../auth/auth.guard";
import { mapRobot, mapRobotDetail } from "../platform/platform-mappers";
import { PlatformClientService } from "../platform/platform-client.service";

const MOCK_ROBOTS: Robot[] = [
  { id: "robot-a", name: "Robot A", model: "Model X", status: "online", scenario: "Mall Guide" },
  { id: "robot-b", name: "Robot B", model: "Model Y", status: "offline" },
  { id: "robot-c", name: "Store Bot", model: "Model Z", status: "busy", scenario: "Inventory Scan" },
];

const MOCK_ROBOT_DETAILS: Record<string, RobotDetail> = {
  "robot-a": {
    ...MOCK_ROBOTS[0],
    position: { x: 12.5, y: 8.3 },
    battery: 85,
  },
  "robot-b": {
    ...MOCK_ROBOTS[1],
    position: { x: 0, y: 0 },
    battery: 45,
  },
  "robot-c": {
    ...MOCK_ROBOTS[2],
    position: { x: 23.1, y: 15.7 },
    battery: 92,
  },
};

function authHeaders(authorization?: string): Record<string, string> {
  return authorization ? { Authorization: authorization } : {};
}

@Controller("robots")
@UseGuards(ConditionalAuthGuard)
export class RobotsController {
  constructor(
    private readonly platform: PlatformClientService,
    private readonly audit: AuditService
  ) {}

  @Get()
  async list(@Headers("authorization") authorization?: string): Promise<Robot[]> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<unknown>(
        "/robots",
        "GET",
        undefined,
        authHeaders(authorization)
      );
      const arr = Array.isArray(data) ? data : [];
      return arr.map((item) => mapRobot(item));
    }
    return MOCK_ROBOTS;
  }

  @Get(":id")
  async get(
    @Param("id") id: string,
    @Headers("authorization") authorization?: string
  ): Promise<RobotDetail> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<unknown>(
        `/robots/${id}`,
        "GET",
        undefined,
        authHeaders(authorization)
      );
      return mapRobotDetail(data);
    }
    const robot = MOCK_ROBOT_DETAILS[id];
    if (!robot) {
      throw new NotFoundException("Robot not found");
    }
    return robot;
  }

  @Post(":id/commands")
  async sendCommand(
    @Param("id") id: string,
    @Body() body: RobotCommandRequest,
    @Headers("authorization") authorization?: string
  ): Promise<void> {
    this.audit.logCommand(id, body.command);
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      // SAI AUROSY uses singular /command
      await this.platform.forward(
        `/robots/${id}/command`,
        "POST",
        { command: body.command, ...(body.params && { params: body.params }) },
        authHeaders(authorization)
      );
    }
  }
}
