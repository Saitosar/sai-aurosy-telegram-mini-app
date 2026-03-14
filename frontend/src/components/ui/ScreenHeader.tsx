import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "./utils";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** When provided, shows back button and calls on click */
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  centered?: boolean;
  className?: string;
};

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightSlot,
  centered = false,
  className,
}: ScreenHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        centered && "text-center items-center",
        !!rightSlot && !centered && "flex-row items-start justify-between gap-4",
        className
      )}
    >
      <div className={cn("flex items-center gap-4 min-w-0 flex-1", centered && "flex-col")}>
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] touch-target shrink-0"
            whileTap={{ scale: 0.98 }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        )}
        <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "text-sm text-muted-foreground mt-0.5",
                centered && "max-w-[280px]"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}
