import { Link } from "react-router-dom";
import { Bot, Store, MapPin, Sparkles } from "lucide-react";
import { TonWalletSection } from "../../components/wallet/TonWalletSection";
import { MockActions } from "../../components/wallet/MockActions";

export function DashboardScreen() {
  return (
    <div className="min-h-full">
      <div className="px-6 py-8">
        <div className="mb-6 space-y-4">
          <TonWalletSection />
          <MockActions />
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] uppercase font-bold">
            SAI AUROSY
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Strategic regional player.</p>
        </div>

        <div className="space-y-4">
          <Link to="/robots" className="block">
            <div className="glass-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group">
              <div className="flex flex-col gap-4">
                <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  <Bot className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight mb-1">My Robots</h3>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">
                    View, manage, and monitor the health of your robotic fleet in real-time.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/store" className="block">
            <div className="glass-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group">
              <div className="flex flex-col gap-4">
                <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  <Store className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight mb-1">Robot Store</h3>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">
                    Browse new models, upgrade capabilities, and scale your automated workforce.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/scripts" className="block">
            <div className="glass-card rounded-2xl p-6 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group">
              <div className="flex flex-col gap-4">
                <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight mb-1">Scripts</h3>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">
                    Browse and run scripts on your robots. Behavioral, speech, and hybrid scenarios.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/demo" className="block">
            <div className="glass-card rounded-2xl p-6 border-toxic/30 hover:border-toxic/50 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all group">
              <div className="flex flex-col gap-4">
                <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center group-hover:border-toxic/30 transition-colors">
                  <Sparkles className="w-5 h-5 text-toxic drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight mb-1">Event Mode Demo</h3>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">
                    See how AGIBOT X2 creates entertainment experiences in your mall.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 glass-card-elevated rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <h3 className="mb-2 text-white font-semibold relative z-10">Quick Start</h3>
          <p className="text-[#a0a0a0] text-sm mb-6 leading-relaxed relative z-10">
            Connect your first robot from the Store or view your existing fleet in Robots.
          </p>
          <div className="flex gap-3 relative z-10">
            <Link
              to="/store"
              className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-colors rounded-xl text-sm font-semibold tracking-wide"
            >
              Browse Store
            </Link>
            <Link
              to="/robots"
              className="glass-button-secondary px-5 py-2.5 text-white hover:bg-white/10 transition-colors rounded-xl text-sm font-medium"
            >
              My Robots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
