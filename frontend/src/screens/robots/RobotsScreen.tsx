import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Plus, Power, Play, Store, MessageCircle } from "lucide-react";
import type { Robot } from "shared";
import { getRobots } from "../../api/robots";
import { haptic } from "../../utils/haptic";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";

export function RobotsScreen() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { step, isCompleted, markCompleted } = useOnboardingProgress();

  useEffect(() => {
    getRobots()
      .then(setRobots)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load robots"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (robots.length > 0) markCompleted();
  }, [robots.length, markCompleted]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-[var(--status-online)]";
      case "offline":
        return "bg-[var(--status-offline)]";
      case "busy":
        return "bg-[var(--status-busy)]";
      case "error":
        return "bg-[var(--status-error)]";
      default:
        return "bg-[var(--status-warning)]";
    }
  };

  const getStatusText = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="px-4 sm:px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-5"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1 rounded-2xl" />
                  <Skeleton className="h-10 flex-1 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-4 sm:px-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>
          <motion.button
            onClick={() => {
              haptic.impact("light");
              setError(null);
              setLoading(true);
              getRobots()
                .then(setRobots)
                .catch((err) => setError(err instanceof Error ? err.message : "Failed to load robots"))
                .finally(() => setLoading(false));
            }}
            className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium"
            whileTap={{ scale: 0.98 }}
          >
            Retry
          </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <ScreenHeader
          title="My Robots"
          subtitle="Connect and control your fleet"
          rightSlot={
            <motion.button
              onClick={() => haptic.impact("light")}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center glass-button-secondary text-primary rounded-2xl hover:bg-muted/50 transition-colors touch-target"
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          }
          className="mb-8"
        />

        {robots.length === 0 ? (
          <EmptyState
            title="No robots deployed"
            description={
              isCompleted
                ? "Connect your first unit or browse models in the Store."
                : "Подключите первого робота за 3 шага"
            }
            action={{
              label: "Browse Store",
              href: "/store",
              onClick: () => haptic.impact("light"),
            }}
            steps={
              isCompleted
                ? undefined
                : [
                    {
                      label: "Browse Store",
                      href: "/store",
                      completed: step >= 2,
                      icon: Store,
                    },
                    {
                      label: "Order robot",
                      href: "/store",
                      completed: step >= 3,
                      icon: MessageCircle,
                    },
                    {
                      label: "Start control",
                      completed: false,
                      icon: Power,
                    },
                  ]
            }
            progress={
              isCompleted ? undefined : (step >= 2 ? 1 : 0) + (step >= 3 ? 1 : 0)
            }
          />
        ) : (
          <div className="space-y-4">
            {robots.map((robot, i) => (
              <motion.div
                key={robot.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={`rounded-3xl p-4 sm:p-6 hover:bg-muted/30 transition-all group ${robot.status === "online" ? "glass-card-elevated" : "glass-card"}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl glass-icon-container">
                      <Bot
                        className={`w-6 h-6 ${robot.status === "online" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground tracking-tight text-[17px]">{robot.name}</h3>
                      </div>
                      <p className="text-[13px] text-muted-foreground font-medium">{robot.model}</p>
                      {robot.scenario && (
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-primary/10 rounded-md">
                          <span className="text-[11px] font-medium text-primary">
                            Running: {robot.scenario}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full glass-button-secondary">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)}`} />
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {getStatusText(robot.status)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                    <Link
                      to={`/control/${robot.id}`}
                      onClick={() => haptic.impact("light")}
                      className="block min-h-[44px] py-3 rounded-2xl text-center transition-colors font-medium text-sm bg-primary text-primary-foreground hover:opacity-90"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Power className="w-4 h-4" />
                        Control
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                    <Link
                      to="/scripts"
                      state={{ selectedRobot: robot.id }}
                      onClick={() => haptic.impact("light")}
                      className="block min-h-[44px] py-3 rounded-2xl text-center transition-colors font-medium text-sm glass-button-secondary text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Scripts
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
