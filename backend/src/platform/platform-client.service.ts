import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface ForwardResult<T> {
  status: number;
  data: T;
}

@Injectable()
export class PlatformClientService {
  constructor(private readonly config: ConfigService) {}

  getBaseUrl(): string | null {
    const url = this.config.get<string>("PLATFORM_API_URL");
    return url && url.trim() !== "" ? url.replace(/\/$/, "") : null;
  }

  /**
   * Builds platform API path. Prepends /api/v1 for SAI AUROSY compatibility.
   */
  buildPath(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return normalized.startsWith("/api/v1") ? normalized : `/api/v1${normalized}`;
  }

  async forward<T>(
    path: string,
    method: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ForwardResult<T>> {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) {
      throw new Error("PLATFORM_API_URL is not configured");
    }

    const fullPath = this.buildPath(path);
    const url = `${baseUrl}${fullPath}`;
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers: reqHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      throw new HttpException(
        "Platform unreachable",
        HttpStatus.BAD_GATEWAY
      );
    }

    const text = await res.text();
    let data: T;
    if (res.status === 204 || !text) {
      data = undefined as T;
    } else {
      try {
        data = JSON.parse(text) as T;
      } catch {
        throw new HttpException(
          "Platform returned invalid JSON",
          HttpStatus.BAD_GATEWAY
        );
      }
    }

    if (!res.ok) {
      const status = (res.status >= 400 && res.status < 600
        ? res.status
        : HttpStatus.BAD_GATEWAY) as HttpStatus;
      throw new HttpException(
        (data as { message?: string })?.message ?? res.statusText,
        status
      );
    }

    return { status: res.status, data };
  }
}
