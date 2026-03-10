import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuditModule } from "../audit/audit.module";
import { RobotsController } from "./robots.controller";

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [RobotsController],
})
export class RobotsModule {}
