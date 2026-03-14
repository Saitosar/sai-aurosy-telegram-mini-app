import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Bot, Store, MapPin, ImageIcon, Settings } from "lucide-react";
import { haptic } from "../../utils/haptic";

export function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active: boolean) =>
    `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex flex-col h-screen text-foreground relative">
      <div className="absolute inset-0 z-[-1] pointer-events-none" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="border-t border-border bg-background/95 backdrop-blur-xl pb-safe">
        <div className="flex items-center justify-between px-2 py-2 gap-1">
          <Link
            to="/"
            onClick={() => haptic.selection()}
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
            <span className="text-[11px] font-medium truncate">Home</span>
          </Link>

          <Link to="/robots" onClick={() => haptic.selection()} className={navLinkClass(isActive("/robots"))}>
            <Bot className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-medium truncate">Robots</span>
          </Link>

          <Link to="/store" onClick={() => haptic.selection()} className={navLinkClass(isActive("/store"))}>
            <Store className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-medium truncate">Store</span>
          </Link>

          <Link to="/wallet" onClick={() => haptic.selection()} className={navLinkClass(isActive("/wallet"))}>
            <ImageIcon className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-medium truncate">NFT</span>
          </Link>

          <Link to="/scripts" onClick={() => haptic.selection()} className={navLinkClass(isActive("/scripts"))}>
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-medium truncate">Scripts</span>
          </Link>

          <Link to="/settings" onClick={() => haptic.selection()} className={navLinkClass(isActive("/settings"))}>
            <Settings className="w-5 h-5 shrink-0" />
            <span className="text-[11px] font-medium truncate">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
