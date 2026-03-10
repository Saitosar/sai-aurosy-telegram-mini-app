import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TelemetryController } from "./telemetry.controller";

@Module({
  imports: [AuthModule],
  controllers: [TelemetryController],
})
export class TelemetryModule {}
