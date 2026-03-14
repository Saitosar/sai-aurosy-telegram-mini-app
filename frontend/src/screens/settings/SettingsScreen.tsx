import { Link } from "react-router-dom";
import { User, Sun, Moon, Globe, ChevronRight, MapPin } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocale, LOCALES } from "../../contexts/LocaleContext";

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Settings</h1>

        <div className="glass-card rounded-2xl overflow-hidden">
          <Link
            to="/settings/profile"
            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
          >
            <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">User Profile</p>
              <p className="text-sm text-muted-foreground">View and manage your profile</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>

          <div className="border-t border-border/50">
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === "dark" ? "Dark" : "Light"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="shrink-0 w-12 h-7 rounded-full bg-muted relative transition-colors hover:opacity-90"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-primary transition-all ${
                    theme === "dark" ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="border-t border-border/50">
            <h3 className="px-4 pt-4 pb-2 text-xs font-medium text-muted-foreground">
              Map settings
            </h3>
            <Link
              to="/scripts/mall-guide/calibration"
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Calibration</p>
                <p className="text-sm text-muted-foreground">Calibrate mall map store positions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </Link>
          </div>

          <div className="border-t border-border/50">
            <div className="flex items-center gap-4 p-4">
              <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">App language (translations coming soon)</p>
              </div>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as (typeof LOCALES)[number]["code"])}
                className="shrink-0 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {LOCALES.map((localeOption) => (
                  <option key={localeOption.code} value={localeOption.code}>
                    {localeOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
