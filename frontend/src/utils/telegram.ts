/**
 * Telegram WebApp utilities.
 * Safe to use when not in Telegram (e.g. local dev) - returns null/empty.
 */

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
};

type TgWebApp = {
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
};

function getWebApp(): TgWebApp | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
}

/**
 * Reads initData from Telegram WebApp when available.
 * When not in Telegram (e.g. local dev), returns empty string - auth may use mock flow.
 */
export function getInitData(): string {
  return getWebApp()?.initData ?? "";
}

/**
 * Returns user object from initDataUnsafe when available.
 * Can be null when Mini App is opened from keyboard or inline mode.
 */
export function getTelegramUser(): TelegramUser | null {
  return getWebApp()?.initDataUnsafe?.user ?? null;
}

/**
 * Returns true when running inside Telegram WebApp.
 */
export function isInTelegram(): boolean {
  return !!getWebApp();
}
