import { Settings } from "lucide-react";

export function SettingsScreen() {
  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">Settings</h1>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col items-center gap-4 py-8">
            <div className="glass-icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            </div>
            <p className="text-[#a0a0a0] text-sm text-center">
              Settings and preferences will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
