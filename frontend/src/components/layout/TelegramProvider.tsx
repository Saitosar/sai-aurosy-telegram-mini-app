import { useEffect } from "react";

/**
 * Initializes Telegram WebApp SDK when running inside Telegram.
 * Calls ready(), expand(), and optionally applies theme from themeParams.
 * Safe to use when not in Telegram (e.g. local dev) - SDK methods are no-ops.
 */
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void } } })
      .Telegram?.WebApp;
    if (tg) {
      tg.ready?.();
      tg.expand?.();
    }
  }, []);

  return <>{children}</>;
}
