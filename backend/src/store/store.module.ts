import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { StoreController } from "./store.controller";

@Module({
  imports: [AuthModule],
  controllers: [StoreController],
})
export class StoreModule {}
