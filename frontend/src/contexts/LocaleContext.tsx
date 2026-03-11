import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "app-locale";

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "uz", label: "Uzbek" },
  { code: "az", label: "Azerbaijani" },
  { code: "ar-AE", label: "Arabic (UAE)" },
  { code: "tr", label: "Turkish" },
  { code: "ru", label: "Russian" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function loadLocale(): LocaleCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const found = LOCALES.find((l) => l.code === stored);
    if (found) return found.code;
  } catch {
    // ignore
  }
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(loadLocale);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = useCallback((value: LocaleCode) => {
    setLocaleState(value);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
