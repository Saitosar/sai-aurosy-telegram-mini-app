import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import type { Telemetry } from "shared";
import { ConditionalAuthGuard } from "../auth/auth.guard";

const MOCK_TELEMETRY: Record<string, Telemetry> = {
  "robot-a": {
    robotId: "robot-a",
    timestamp: new Date().toISOString(),
    status: "online",
    position: { x: 12.5, y: 8.3 },
    battery: 85,
  },
  "robot-b": {
    robotId: "robot-b",
    timestamp: new Date().toISOString(),
    status: "offline",
    position: { x: 0, y: 0 },
    battery: 45,
  },
  "robot-c": {
    robotId: "robot-c",
    timestamp: new Date().toISOString(),
    status: "busy",
    position: { x: 23.1, y: 15.7 },
    battery: 92,
  },
};

@Controller("telemetry")
@UseGuards(ConditionalAuthGuard)
export class TelemetryController {

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
   * No poll endpoint. Use mock until platform adds one. TODO: implement SSE proxy.
   */
  @Get(":robotId")
  async get(@Param("robotId") robotId: string): Promise<Telemetry> {
    const data = MOCK_TELEMETRY[robotId];
    if (!data) throw new NotFoundException("Robot not found");
    return { ...data, timestamp: new Date().toISOString() };
  }
}
