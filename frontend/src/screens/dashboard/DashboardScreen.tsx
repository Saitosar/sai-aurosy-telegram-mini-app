import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, Sparkles, ChevronRight, Gem, MapPin } from "lucide-react";
import { ProfileInfoCard } from "../../components/wallet/ProfileInfoCard";

const staggerItem = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
});

export function DashboardScreen() {
  return (
    <div className="min-h-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 py-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl tracking-tighter text-foreground font-semibold">
            SAI Control
          </h1>
          <p className="text-muted-foreground text-sm font-medium max-w-[280px] mx-auto">
            Your robots, one tap away. Control, monitor, and scale from Telegram.
          </p>
        </div>

        <div className="space-y-4">
          <motion.div {...staggerItem(0)}>
            <ProfileInfoCard />
          </motion.div>

          <motion.div {...staggerItem(1)}>
          <Link to="/demo" className="block group">
            <div className="glass-card-elevated rounded-3xl p-4 sm:p-6 hover:bg-muted/30 transition-all relative">
              <span className="absolute top-3 right-12 text-[10px] font-medium text-toxic bg-toxic/10 px-2 py-0.5 rounded">
                Live
              </span>
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-muted border border-border transition-colors">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight mb-1">
                    Event Mode Demo
                  </h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    See AGIBOT X2 in action — try the live demo
                  </p>
                </div>
              </div>
            </div>
          </Link>
          </motion.div>

          <motion.div {...staggerItem(2)}>
          <Link to="/store" className="block group">
            <div className="glass-card-elevated rounded-3xl p-4 sm:p-6 hover:bg-muted/30 transition-all relative">
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-muted border border-border transition-colors">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight mb-1">
                    Robot Store
                  </h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    Add robots to your fleet — browse and get started
                  </p>
                </div>
              </div>
            </div>
          </Link>
          </motion.div>

          <motion.div {...staggerItem(3)}>
          <Link to="/scripts" className="block group">
            <div className="glass-card rounded-3xl p-4 sm:p-6 hover:bg-muted/30 transition-all relative">
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-muted border border-border transition-colors">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight mb-1">
                    Scripts
                  </h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    Browse and run scripts — behavioral, speech, Mall Guide
                  </p>
                </div>
              </div>
            </div>
          </Link>
          </motion.div>

          <motion.div {...staggerItem(4)}>
          <Link to="/wallet" className="block group">
            <div className="glass-card rounded-3xl p-4 sm:p-6 hover:bg-muted/30 transition-all relative">
              <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-muted border border-border transition-colors">
                  <Gem className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight mb-1">
                    NFT
                  </h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    View your NFT collection and robot assets
                  </p>
                </div>
              </div>
            </div>
          </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
