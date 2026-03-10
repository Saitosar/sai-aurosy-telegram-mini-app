import { apiFetch } from "./client";
import type { Telemetry } from "shared";

export async function getTelemetry(robotId: string): Promise<Telemetry> {
  return apiFetch<Telemetry>(`/telemetry/${robotId}`);
}

export interface TelemetryTransport {
  subscribe(
    robotId: string,
    onUpdate: (data: Telemetry) => void
  ): { unsubscribe: () => void };
}

export function createPollingTransport(intervalMs = 3000): TelemetryTransport {
  return {
    subscribe(
    robotId: string,
    onUpdate: (data: Telemetry) => void
  ): { unsubscribe: () => void } {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await getTelemetry(robotId);
        if (!cancelled) onUpdate(data);
      } catch {
        // Ignore errors; next poll will retry
      }
      if (!cancelled) {
        setTimeout(poll, intervalMs);
      }
    };
    poll();
    return {
      unsubscribe: () => {
        cancelled = true;
      },
    };
  },
  };
}

/**
 * SSE transport stub. When backend exposes GET /telemetry/:robotId/stream,
 * implement EventSource-based subscription here.
 */
export function createSSETransport(): TelemetryTransport {
  return {
    subscribe(): { unsubscribe: () => void } {
      return { unsubscribe: () => {} };
    },
  };
}

export const defaultTransport = createPollingTransport(3000);
