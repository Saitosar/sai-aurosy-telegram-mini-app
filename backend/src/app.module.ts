import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { MallGuideModule } from "./mall-guide/mall-guide.module";
import { PlatformModule } from "./platform";
import { RobotsModule } from "./robots/robots.module";
import { ScenariosModule } from "./scenarios/scenarios.module";
import { StoreModule } from "./store/store.module";
import { TelemetryModule } from "./telemetry/telemetry.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), ".env"), join(process.cwd(), "..", ".env")],
    }),
    PlatformModule,
    AuthModule,
    MallGuideModule,
    RobotsModule,
    StoreModule,
    ScenariosModule,
    TelemetryModule,
  ],
})
export class AppModule {}
