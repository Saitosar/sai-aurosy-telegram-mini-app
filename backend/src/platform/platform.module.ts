import { Global, Module } from "@nestjs/common";
import { PlatformClientService } from "./platform-client.service";

@Global()
@Module({
  providers: [PlatformClientService],
  exports: [PlatformClientService],
})
export class PlatformModule {}
