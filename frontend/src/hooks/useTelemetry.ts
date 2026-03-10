import { useEffect, useMemo, useState } from "react";
import type { Telemetry } from "shared";
import { defaultTransport } from "../api/telemetry";

const STALE_THRESHOLD_MS = 10_000;

export function useTelemetry(
  robotId: string | undefined,
  transport = defaultTransport
): {
  data: Telemetry | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  isStale: boolean;
} {
  const [data, setData] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!robotId) {
      setData(null);
      setLoading(false);
      setError(null);
      setLastUpdated(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLastUpdated(null);

    const { unsubscribe } = transport.subscribe(robotId, (t) => {
      setData(t);
      setLastUpdated(new Date());
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [robotId, transport]);

  // Periodic tick to recompute isStale (every 2s when we have data)
  useEffect(() => {
    if (!data) return;
    const id = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, [data]);

  const isStale = useMemo(
    () =>
      lastUpdated === null ||
      Date.now() - lastUpdated.getTime() > STALE_THRESHOLD_MS,
    [lastUpdated, tick]
  );

  return { data, loading, error, lastUpdated, isStale };
}
