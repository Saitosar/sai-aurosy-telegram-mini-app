import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Bot, Store, MapPin } from "lucide-react";

export function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen text-foreground relative">
      <div className="absolute inset-0 z-[-1] pointer-events-none" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="border-t border-white/5 bg-[#0a0a0c]/90 backdrop-blur-md pb-safe">
        <div className="flex items-center justify-around px-4 py-3">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              isActive("/") && !isActive("/robots") && !isActive("/store") && !isActive("/scenarios")
                ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            <Home className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">Home</span>
          </Link>

          <Link
            to="/robots"
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              isActive("/robots")
                ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            <Bot className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">Robots</span>
          </Link>

          <Link
            to="/store"
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              isActive("/store")
                ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            <Store className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">Store</span>
          </Link>

          <Link
            to="/scenarios/mall-guide"
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              isActive("/scenarios")
                ? "text-[#39ff14] scale-110 drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]"
                : "text-[#666] hover:text-[#999]"
            }`}
          >
            <MapPin className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">Guide</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
