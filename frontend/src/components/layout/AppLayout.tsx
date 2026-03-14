import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Cpu, Store, Settings } from "lucide-react";
import { haptic } from "../../utils/haptic";

export function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active: boolean) =>
    `flex items-center justify-center min-h-[44px] min-w-[44px] rounded-2xl border transition-all flex-1 touch-target ${
      active
        ? "text-primary border-primary/50 bg-primary/10"
        : "text-muted-foreground hover:text-foreground border-border/60 hover:border-border bg-transparent"
    }`;

  return (
    <div className="flex flex-col h-screen text-foreground relative">
      <div className="absolute inset-0 z-[-1] pointer-events-none" />
      <main className="flex-1 overflow-y-auto pb-[var(--tab-bar-spacer)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed inset-x-4 sm:inset-x-6 bottom-[calc(12px+env(safe-area-inset-bottom))] glass-card rounded-3xl z-10">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-4">
          <motion.div whileTap={{ scale: 0.98 }} className="flex-1 min-w-0">
            <Link to="/" onClick={() => haptic.selection()} className={navLinkClass(isActive("/"))} aria-label="Home">
              <Home className="w-5 h-5 shrink-0" />
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }} className="flex-1 min-w-0">
            <Link to="/robots" onClick={() => haptic.selection()} className={navLinkClass(isActive("/robots"))} aria-label="Robots">
              <Cpu className="w-5 h-5 shrink-0" />
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }} className="flex-1 min-w-0">
            <Link to="/store" onClick={() => haptic.selection()} className={navLinkClass(isActive("/store"))} aria-label="Store">
              <Store className="w-5 h-5 shrink-0" />
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }} className="flex-1 min-w-0">
            <Link to="/settings" onClick={() => haptic.selection()} className={navLinkClass(isActive("/settings"))} aria-label="Settings">
              <Settings className="w-5 h-5 shrink-0" />
            </Link>
          </motion.div>
        </div>
      </nav>
    </div>
  );
}
