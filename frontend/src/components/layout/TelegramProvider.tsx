import { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

type TgWebApp = {
  ready?: () => void;
  expand?: () => void;
  setBackgroundColor?: (color: string) => void;
  setHeaderColor?: (color: string) => void;
  themeParams?: { bg_color?: string; secondary_bg_color?: string; header_bg_color?: string };
  colorScheme?: string;
  onEvent?: (event: string, handler: () => void) => void;
};

/**
 * Initializes Telegram WebApp SDK when running inside Telegram.
 * Calls ready(), expand(), applies theme from themeParams, syncs colorScheme with app theme.
 * Safe to use when not in Telegram (e.g. local dev) - SDK methods are no-ops.
 */
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
    if (!tg) return;

    tg.ready?.();
    tg.expand?.();

    const applyColors = () => {
      const params = tg.themeParams;
      if (!params) return;
      const bg = params.bg_color ?? params.secondary_bg_color ?? "#050508";
      const header =
        params.header_bg_color ?? params.bg_color ?? params.secondary_bg_color ?? "#050508";
      tg.setBackgroundColor?.(bg);
      tg.setHeaderColor?.(header);
    };

    const syncTheme = () => {
      const scheme = tg.colorScheme;
      if (scheme === "light" || scheme === "dark") {
        setTheme(scheme);
      }
    };

    applyColors();
    syncTheme();
    tg.onEvent?.("themeChanged", () => {
      applyColors();
      syncTheme();
    });
  }, [setTheme]);

  return <>{children}</>;
}
