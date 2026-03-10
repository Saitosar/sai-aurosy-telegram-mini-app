import { Link } from "react-router-dom";
import { Bot, Store, MapPin } from "lucide-react";

export function DashboardScreen() {
  return (
    <div className="min-h-full">
      <div className="px-6 py-8">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)] uppercase font-bold">
            SAI AUROSY
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Strategic regional player.</p>
        </div>

        <div className="space-y-4">
          <Link to="/robots" className="block">
            <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 bg-[#1f1f22] rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors">
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
            <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 bg-[#1f1f22] rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors">
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

          <Link to="/scenarios/mall-guide" className="block">
            <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 bg-[#1f1f22] rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight mb-1">Mall Guide Scenario</h3>
                  <p className="text-[#a0a0a0] text-[13px] leading-relaxed">
                    Deploy interactive wayfinding, automate patrols, and manage spatial data.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-[#1f1f22]/50 to-[#111111]/50 border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <h3 className="mb-2 text-white font-semibold">Quick Start</h3>
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
              className="px-5 py-2.5 bg-white/5 text-white hover:bg-white/10 transition-colors rounded-xl text-sm font-medium"
            >
              My Robots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
