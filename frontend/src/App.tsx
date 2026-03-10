import { RouterProvider } from "react-router-dom";
import { TelegramProvider } from "./components/layout/TelegramProvider";
import { useTelegramAuth } from "./auth/useTelegramAuth";
import { router } from "./routes";

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
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  );
}
