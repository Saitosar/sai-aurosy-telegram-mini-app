import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuditModule } from "../audit/audit.module";
import { ScenariosController } from "./scenarios.controller";

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [ScenariosController],
})
export class ScenariosModule {}
