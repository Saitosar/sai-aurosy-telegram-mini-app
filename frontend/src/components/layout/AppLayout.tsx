import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Bot, Store, MapPin, ImageIcon, Settings } from "lucide-react";

export function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active: boolean, scriptsStyle = false) =>
    `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 ${
      active
        ? scriptsStyle
          ? "text-[#39ff14] scale-110 drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]"
          : "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
        : "text-[#666] hover:text-[#999]"
    }`;

  return (
    <div className="flex flex-col h-screen text-foreground relative">
      <div className="absolute inset-0 z-[-1] pointer-events-none" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="border-t border-white/10 bg-black/30 backdrop-blur-xl pb-safe">
        <div className="flex items-center justify-between px-2 py-2 gap-1">
          <Link
            to="/"
            className={navLinkClass(
              isActive("/") &&
                !isActive("/robots") &&
                !isActive("/store") &&
                !isActive("/scripts") &&
                !isActive("/wallet") &&
                !isActive("/settings")
            )}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">Home</span>
          </Link>

          <Link to="/robots" className={navLinkClass(isActive("/robots"))}>
            <Bot className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">Robots</span>
          </Link>

          <Link to="/store" className={navLinkClass(isActive("/store"))}>
            <Store className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">Store</span>
          </Link>

          <Link to="/wallet" className={navLinkClass(isActive("/wallet"))}>
            <ImageIcon className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">NFT</span>
          </Link>

          <Link to="/scripts" className={navLinkClass(isActive("/scripts"), true)}>
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">Scripts</span>
          </Link>

          <Link to="/settings" className={navLinkClass(isActive("/settings"))}>
            <Settings className="w-5 h-5 shrink-0" />
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
