import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import type { StoredCalibration } from "shared";
import { ConditionalAuthGuard } from "../auth/auth.guard";
import { CalibrationService } from "./calibration.service";

@Controller("mall-guide")
@UseGuards(ConditionalAuthGuard)
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get("calibration")
  async getCalibration(): Promise<{ data: StoredCalibration; persisted: boolean }> {
    return this.calibrationService.getCalibration();
  }

  @Put("calibration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async putCalibration(@Body() body: StoredCalibration): Promise<void> {
    await this.calibrationService.saveCalibration(body);
  }
}
