/**
 * Auth DTOs - shared between frontend and backend.
 * Aligned with docs/architecture/auth-and-security.md and docs/api/api-overview.md
 */

export interface LoginRequest {
  initData: string;
}

export interface LoginResponse {
  sessionToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}
