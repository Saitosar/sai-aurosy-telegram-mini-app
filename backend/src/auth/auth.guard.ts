import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string> }>();
    const authHeader = request.headers?.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header");
    }
    return true;
  }
}

/**
 * Conditional auth guard: requires Bearer token only when PLATFORM_API_URL is set (pilot mode).
 * In mock mode (no platform), allows unauthenticated access for demo.
 */
@Injectable()
export class ConditionalAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const baseUrl = this.config.get<string>("PLATFORM_API_URL");
    const isPilotMode = baseUrl && baseUrl.trim() !== "";

    if (!isPilotMode) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string> }>();
    const authHeader = request.headers?.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header");
    }
    return true;
  }
}
