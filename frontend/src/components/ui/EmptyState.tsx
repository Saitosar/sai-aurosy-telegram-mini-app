import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, type LucideIcon } from "lucide-react";
import { cn } from "./utils";
import { haptic } from "../../utils/haptic";

export interface EmptyStateStep {
  label: string;
  href?: string;
  onClick?: () => void;
  completed: boolean;
  icon: LucideIcon;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  steps?: EmptyStateStep[];
  /** Number of completed steps (0-3) for progress bar. Derived from steps if not provided. */
  progress?: number;
  className?: string;
}

function RobotIllustration() {
  return (
    <motion.div
      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="w-10 h-10 text-primary" />
      </motion.div>
    </motion.div>
  );
}

export function EmptyState({
  icon: Icon = Bot,
  title,
  description,
  action,
  steps,
  progress = 0,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex flex-col items-start text-left py-16 px-6 glass-card rounded-3xl",
        className
      )}
    >
      {steps && steps.length > 0 ? (
        <RobotIllustration />
      ) : (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}

      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-[260px] text-sm leading-relaxed">
        {description}
      </p>

      {steps && steps.length > 0 && (
        <div className="w-full max-w-[240px] mb-6">
          <div className="flex gap-1.5 mb-4 justify-start">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  i <= progress ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <div className="space-y-3 text-left">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const content = (
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 min-h-[44px] rounded-2xl transition-colors",
                    step.completed
                      ? "bg-primary/10 border border-primary/20"
                      : "glass-button-secondary"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      step.completed ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    {step.completed ? (
                      <span className="text-primary text-xs font-bold">✓</span>
                    ) : (
                      <StepIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.completed ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );

              const handleClick = () => {
                haptic.impact("light");
                step.onClick?.();
              };

              if (step.href && !step.completed) {
                return (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    className="block"
                  >
                    <Link to={step.href} onClick={handleClick} className="block">
                      {content}
                    </Link>
                  </motion.div>
                );
              }
              if (step.onClick && !step.completed) {
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={handleClick}
                    className="w-full text-left"
                    whileTap={{ scale: 0.98 }}
                  >
                    {content}
                  </motion.button>
                );
              }
              return <div key={i}>{content}</div>;
            })}
          </div>
        </div>
      )}

      {action && (
        <motion.div whileTap={{ scale: 0.98 }}>
          {action.href ? (
            <Link
              to={action.href}
              onClick={action.onClick}
              className="inline-flex min-h-[44px] px-6 py-3 items-center justify-center bg-primary text-primary-foreground font-medium rounded-2xl hover:opacity-90 transition-opacity"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex min-h-[44px] px-6 py-3 items-center justify-center bg-primary text-primary-foreground font-medium rounded-2xl hover:opacity-90 transition-opacity"
            >
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
