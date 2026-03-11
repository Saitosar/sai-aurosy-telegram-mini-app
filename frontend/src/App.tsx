import { RouterProvider } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TelegramProvider } from "./components/layout/TelegramProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { useTelegramAuth } from "./auth/useTelegramAuth";
import { router } from "./routes";

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
const twaReturnUrl = import.meta.env.VITE_TWA_RETURN_URL ?? window.location.href;

function AppContent() {
  const { isReady } = useTelegramAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-[#a0a0a0] text-sm">Loading...</div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{ twaReturnUrl }}
    >
      <ThemeProvider>
        <LocaleProvider>
          <TelegramProvider>
            <AppContent />
          </TelegramProvider>
        </LocaleProvider>
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}
