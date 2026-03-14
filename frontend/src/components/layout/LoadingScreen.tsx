import { Bot } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card rounded-3xl p-8 flex flex-col items-start text-left gap-6">
        <div className="p-4 rounded-2xl glass-icon-container animate-pulse">
          <Bot className="w-12 h-12 text-primary" />
        </div>
        <div className="flex flex-col items-start gap-2 w-full max-w-[160px]">
          <div className="h-3 w-full rounded-md shimmer-loading" />
          <div className="h-3 w-3/4 rounded-md shimmer-loading" />
        </div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}
