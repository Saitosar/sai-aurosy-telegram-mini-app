import { motion } from "framer-motion";
import { haptic } from "../../utils/haptic";
import { cn } from "./utils";

export type ControlTab = "info" | "manage";

type InfoManageTabsProps = {
  activeTab: ControlTab;
  onTabChange: (tab: ControlTab) => void;
  className?: string;
};

export function InfoManageTabs({ activeTab, onTabChange, className }: InfoManageTabsProps) {
  const handleTabClick = (tab: ControlTab) => {
    if (tab === activeTab) return;
    haptic.impact("light");
    onTabChange(tab);
  };

  return (
    <div
      className={cn(
        "flex rounded-2xl p-1 glass-card overflow-hidden",
        className
      )}
      role="tablist"
      aria-label="Info and Manage tabs"
    >
      <motion.button
        role="tab"
        aria-selected={activeTab === "info"}
        aria-controls="control-info-panel"
        id="tab-info"
        onClick={() => handleTabClick("info")}
        className={cn(
          "flex-1 min-h-[44px] rounded-xl font-medium text-sm transition-colors touch-target",
          activeTab === "info"
            ? "bg-primary text-primary-foreground"
            : "glass-button-secondary text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        whileTap={{ scale: 0.98 }}
      >
        Info
      </motion.button>
      <motion.button
        role="tab"
        aria-selected={activeTab === "manage"}
        aria-controls="control-manage-panel"
        id="tab-manage"
        onClick={() => handleTabClick("manage")}
        className={cn(
          "flex-1 min-h-[44px] rounded-xl font-medium text-sm transition-colors touch-target",
          activeTab === "manage"
            ? "bg-primary text-primary-foreground"
            : "glass-button-secondary text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        whileTap={{ scale: 0.98 }}
      >
        Manage
      </motion.button>
    </div>
  );
}
