import { useEffect, useState } from "react";
import { login } from "../api/auth";
import { setSessionTokens, clearSession, isAuthenticated } from "./session";
import { getInitData } from "../utils/telegram";

/**
 * Telegram auth bootstrap hook.
 * On mount: if initData present and no session, calls POST /auth/login.
 * Platform validates initData HMAC; we only forward it.
 */
export function useTelegramAuth() {
  const [isReady, setIsReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const initData = getInitData();

    if (authenticated) {
      setIsReady(true);
      return;
    }

    if (initData) {
      login({ initData })
        .then((res) => {
          setSessionTokens(res.sessionToken, res.refreshToken);
          setAuthenticated(true);
        })
        .catch(() => {
          // Auth failed - continue without session (mock API may still work)
        })
        .finally(() => setIsReady(true));
    } else {
      // Not in Telegram - skip auth; mock API may work without token
      setIsReady(true);
    }
  }, [authenticated]);

  return { isReady, authenticated };
}

export function useLogout() {
  return () => {
    clearSession();
    window.location.reload();
  };
}
