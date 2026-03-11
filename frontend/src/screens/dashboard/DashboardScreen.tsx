import { Link } from "react-router-dom";
import { Store, Sparkles, ChevronRight } from "lucide-react";
import { TonWalletSection } from "../../components/wallet/TonWalletSection";

export function DashboardScreen() {
  return (
    <div className="min-h-full">
      <div className="px-6 py-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] font-bold">
            SAI Control
          </h1>
          <p className="text-[var(--tg-theme-hint-color,#a1a1aa)] text-sm font-medium max-w-[280px] mx-auto">
            Your robots, one tap away. Control, monitor, and scale from Telegram.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/demo" className="block group">
            <div className="glass-card rounded-2xl p-6 border-toxic/30 hover:border-toxic/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] hover:scale-[1.02] transition-all relative">
              <span className="absolute top-3 right-12 text-[10px] font-bold uppercase tracking-wider text-toxic bg-toxic/10 px-2 py-0.5 rounded">
                Live
              </span>
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-toxic/70 group-hover:text-toxic transition-colors" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-toxic/10 border border-toxic/20 group-hover:border-toxic/40 transition-colors">
                  <Sparkles className="w-8 h-8 text-toxic drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
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
            <div className="glass-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:scale-[1.02] transition-all relative">
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                  <Store className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
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

          <TonWalletSection />
        </div>
      </div>
    </div>
  );
}
