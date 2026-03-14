import { Link } from "react-router-dom";
import { Store, Sparkles, ChevronRight } from "lucide-react";
import { ProfileInfoCard } from "../../components/wallet/ProfileInfoCard";

export function DashboardScreen() {
  return (
    <div className="min-h-full">
      <div className="px-6 py-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl tracking-tighter text-foreground font-semibold">
            SAI Control
          </h1>
          <p className="text-[var(--tg-theme-hint-color,#a1a1aa)] text-sm font-medium max-w-[280px] mx-auto">
            Your robots, one tap away. Control, monitor, and scale from Telegram.
          </p>
        </div>

        <div className="space-y-4">
          <ProfileInfoCard />

          <Link to="/demo" className="block group">
            <div className="glass-card rounded-2xl p-6 hover:bg-muted/30 transition-all relative">
              <span className="absolute top-3 right-12 text-[10px] font-medium text-toxic bg-toxic/10 px-2 py-0.5 rounded">
                Live
              </span>
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-toxic/10 border border-toxic/20 transition-colors">
                  <Sparkles className="w-8 h-8 text-toxic" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-[var(--tg-theme-text-color,#fafafa)] tracking-tight mb-1">
                    Event Mode Demo
                  </h3>
                  <p className="text-[var(--tg-theme-hint-color,#a1a1aa)] text-[13px] leading-relaxed">
                    See AGIBOT X2 in action — try the live demo
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/store" className="block group">
            <div className="glass-card rounded-2xl p-6 hover:bg-muted/30 transition-all relative">
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 transition-colors">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-[var(--tg-theme-text-color,#fafafa)] tracking-tight mb-1">
                    Robot Store
                  </h3>
                  <p className="text-[var(--tg-theme-hint-color,#a1a1aa)] text-[13px] leading-relaxed">
                    Add robots to your fleet — browse and get started
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
