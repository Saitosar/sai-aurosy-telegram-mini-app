import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, LogIn } from "lucide-react";
import { login } from "../../api/auth";
import { setSessionTokens } from "../../auth/session";
import { isAuthenticated } from "../../auth/session";
import { getTelegramUser, getInitData, isInTelegram } from "../../utils/telegram";

export function UserProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticated = isAuthenticated();
  const user = getTelegramUser();
  const initData = getInitData();
  const inTelegram = isInTelegram();

  const handleLogin = async () => {
    if (!initData) return;
    setLoading(true);
    setError(null);
    try {
      const res = await login({ initData });
      setSessionTokens(res.sessionToken, res.refreshToken);
      window.location.reload();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Settings</span>
        </Link>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">User Profile</h1>

        {!authenticated ? (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4 py-8">
              <div className="glass-icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm text-center">
                {inTelegram && initData
                  ? "Sign in with your Telegram account to view your profile."
                  : "Open this Mini App from Telegram to sign in and view your profile."}
              </p>
              {inTelegram && initData && (
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? "Signing in..." : "Sign in with Telegram"}
                </button>
              )}
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>
        ) : user ? (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-primary/30">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {[user.first_name, user.last_name].filter(Boolean).join(" ")}
                </h2>
                {user.username && (
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                )}
              </div>
              <dl className="w-full space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Telegram ID</dt>
                  <dd className="font-mono">{user.id}</dd>
                </div>
                {user.language_code && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Language</dt>
                    <dd>{user.language_code}</dd>
                  </div>
                )}
                {user.is_premium !== undefined && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Premium</dt>
                    <dd>{user.is_premium ? "Yes" : "No"}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4 py-8">
              <div className="glass-icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm text-center">
                User data is not available. This can happen when the Mini App is opened from a
                keyboard or inline mode. Try opening from the bot menu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
