import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConditionalAuthGuard } from "./auth.guard";

@Module({
  controllers: [AuthController],
  providers: [ConditionalAuthGuard],
  exports: [ConditionalAuthGuard],
})
export class AuthModule {}
