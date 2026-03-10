/**
 * Base API client for SAI AUROSY platform.
 * TODO: Switch to platform URL when gateway not used (VITE_API_BASE_URL can point to Gateway or Platform).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export interface ApiError {
  code: string;
  message: string;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = sessionStorage.getItem("sessionToken");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  Object.assign(headers, await getAuthHeader());

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let error: ApiError;
    try {
      const body = await res.json();
      error = body.error ?? { code: "UNKNOWN", message: body.message ?? res.statusText };
    } catch {
      error = { code: "NETWORK_ERROR", message: res.statusText };
    }
    throw new Error(error.message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
