/**
 * Session token storage.
 * Uses sessionStorage; cleared on logout or tab close.
 * Per docs/architecture/auth-and-security.md: no localStorage for sensitive deployments.
 */

const TOKEN_KEY = "sessionToken";
const REFRESH_KEY = "refreshToken";

export function getSessionToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setSessionTokens(sessionToken: string, refreshToken?: string): void {
  sessionStorage.setItem(TOKEN_KEY, sessionToken);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated(): boolean {
  return !!getSessionToken();
}
