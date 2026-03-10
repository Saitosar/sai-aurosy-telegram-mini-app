import { Body, Controller, Headers, Post } from "@nestjs/common";
import type { LoginRequest, LoginResponse } from "shared";
import { PlatformClientService } from "../platform/platform-client.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly platform: PlatformClientService) {}

  /**
   * POST /auth/login
   * Accepts Telegram WebApp initData string.
   * When PLATFORM_API_URL is set, forwards to platform; otherwise returns mock tokens.
   */
  @Post("login")
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const { data } = await this.platform.forward<LoginResponse>(
        "/auth/login",
        "POST",
        body
      );
      return data;
    }
    return {
      sessionToken: `mock-session-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  @Post("logout")
  async logout(@Headers("authorization") authorization?: string): Promise<void> {
    const baseUrl = this.platform.getBaseUrl();
    if (baseUrl) {
      const headers: Record<string, string> = {};
      if (authorization) headers["Authorization"] = authorization;
      await this.platform.forward("/auth/logout", "POST", undefined, headers);
    }
  }
}
