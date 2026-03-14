import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Plus, Power, Play } from "lucide-react";
import type { Robot } from "shared";
import { getRobots } from "../../api/robots";
import { haptic } from "../../utils/haptic";
import { Skeleton } from "../../components/ui/Skeleton";

export function RobotsScreen() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRobots()
      .then(setRobots)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load robots"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-primary";
      case "offline":
        return "bg-muted";
      case "busy":
        return "bg-toxic";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1 rounded-xl" />
                  <Skeleton className="h-10 flex-1 rounded-xl" />
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
      <div className="min-h-full flex flex-col items-center justify-center px-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
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
          >
            Retry
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Robots</h1>
          <button
            onClick={() => haptic.impact("light")}
            className="p-2.5 glass-button-secondary text-primary rounded-xl hover:bg-muted/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {robots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">No robots deployed</h3>
            <p className="text-muted-foreground mb-8 max-w-[200px] text-sm">
              Connect your first unit or browse models in the Store.
            </p>
            <Link
              to="/store"
              onClick={() => haptic.impact("light")}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {robots.map((robot) => (
              <div
                key={robot.id}
                className="glass-card rounded-2xl p-5 hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl glass-icon-container">
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
                <div className="flex gap-3">
                  <Link
                    to={`/control/${robot.id}`}
                    onClick={() => haptic.impact("light")}
                    className="flex-1 py-2.5 rounded-xl text-center transition-colors font-medium text-sm glass-button-secondary text-primary hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-4 h-4" />
                      Control
                    </div>
                  </Link>
                  <Link
                    to="/scripts"
                    state={{ selectedRobot: robot.id }}
                    onClick={() => haptic.impact("light")}
                    className="flex-1 py-2.5 rounded-xl text-center transition-colors font-medium text-sm glass-button-secondary text-primary hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Scripts
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
