import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import type { Telemetry } from "shared";
import { ConditionalAuthGuard } from "../auth/auth.guard";
import { mapTelemetry } from "../platform/platform-mappers";
import { PlatformClientService } from "../platform/platform-client.service";

function authHeaders(authorization?: string): Record<string, string> {
  return authorization ? { Authorization: authorization } : {};
}

const MOCK_TELEMETRY: Record<string, Telemetry> = {
  "robot-a": {
    robotId: "robot-a",
    timestamp: new Date().toISOString(),
    status: "online",
    position: { x: 12.5, y: 8.3 },
    battery: 85,
    temperature: { casing: 42, winding: 38 },
    communicationQuality: 95,
    alarms: [],
  },
  "robot-b": {
    robotId: "robot-b",
    timestamp: new Date().toISOString(),
    status: "offline",
    position: { x: 0, y: 0 },
    battery: 45,
    temperature: { casing: 35, winding: 32 },
    communicationQuality: 62,
    alarms: ["Low signal"],
  },
  "robot-c": {
    robotId: "robot-c",
    timestamp: new Date().toISOString(),
    status: "busy",
    position: { x: 23.1, y: 15.7 },
    battery: 92,
    temperature: { casing: 48, winding: 44 },
    communicationQuality: 88,
    alarms: [],
  },
};

@Controller("telemetry")
@UseGuards(ConditionalAuthGuard)
export class TelemetryController {
  constructor(private readonly platform: PlatformClientService) {}

  /**
   * GET /telemetry/:robotId/stream
   * SSE stream for real-time telemetry.
   * When platform exposes this endpoint, gateway will proxy. Until then, returns 501.
   */
  @Get(":robotId/stream")
  stream(
    @Param("robotId") _robotId: string,
    @Res({ passthrough: false }) res: Response
  ): void {
    res.status(HttpStatus.NOT_IMPLEMENTED).json({
      error: {
        code: "STREAM_NOT_AVAILABLE",
        message:
          "Telemetry stream not available. Use GET /telemetry/:robotId for polling.",
      },
    });
  }

  /**
   * Telemetry: SAI AUROSY has SSE stream only (GET /api/v1/telemetry/stream?robot_id=x).
   * When platform exposes poll endpoint, proxy to it. Otherwise use mock.
   */
  @Get(":robotId")
  async get(
    @Param("robotId") robotId: string,
    @Headers("authorization") authorization?: string
  ): Promise<Telemetry> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<unknown>(
        `/telemetry/${robotId}`,
        "GET",
        undefined,
        authHeaders(authorization)
      );
      return mapTelemetry(data, robotId);
    }
    const data = MOCK_TELEMETRY[robotId];
    if (!data) throw new NotFoundException("Robot not found");
    return { ...data, timestamp: new Date().toISOString() };
  }
}
