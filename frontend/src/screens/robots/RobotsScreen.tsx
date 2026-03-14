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
        return "bg-primary shadow-[0_0_8px_rgba(0,229,255,0.8)]";
      case "offline":
        return "bg-[#333]";
      case "busy":
        return "bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.8)]";
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
                className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,229,255,0.1)]"
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
          <h1 className="text-2xl font-bold tracking-tight text-white">My Robots</h1>
          <button
            onClick={() => haptic.impact("light")}
            className="p-2.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {robots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-primary/10 border border-primary/20 rounded-3xl shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              <Bot className="w-8 h-8 text-primary/70 drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]" />
            </div>
            <h3 className="mb-2 font-semibold text-primary/95 drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]">No robots deployed</h3>
            <p className="text-primary/70 mb-8 max-w-[200px] text-sm">
              Connect your first unit or browse models in the Store.
            </p>
            <Link
              to="/store"
              onClick={() => haptic.impact("light")}
              className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            >
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {robots.map((robot) => (
              <div
                key={robot.id}
                className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:bg-primary/15 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] transition-all group relative overflow-hidden"
              >
                {robot.status === "online" && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                )}
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_8px_rgba(0,229,255,0.15)] group-hover:bg-primary/15 group-hover:border-primary/30 transition-colors">
                      <Bot
                        className={`w-6 h-6 drop-shadow-[0_0_4px_rgba(0,229,255,0.4)] ${robot.status === "online" ? "text-primary" : "text-primary/60"}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-primary/95 tracking-tight text-[17px] drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]">{robot.name}</h3>
                      </div>
                      <p className="text-[13px] text-primary/70 font-medium">{robot.model}</p>
                      {robot.scenario && (
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md shadow-[0_0_6px_rgba(0,229,255,0.1)]">
                          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">
                            Running: {robot.scenario}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_6px_rgba(0,229,255,0.1)]">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)}`} />
                    <span className="text-[11px] text-primary/80 font-medium uppercase tracking-wider">
                      {getStatusText(robot.status)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                  <Link
                    to={`/control/${robot.id}`}
                    onClick={() => haptic.impact("light")}
                    className="flex-1 py-2.5 rounded-xl text-center transition-all font-medium text-sm bg-primary/10 border border-primary/20 text-primary/95 hover:bg-primary/20 hover:border-primary/40 shadow-[0_0_8px_rgba(0,229,255,0.1)] hover:shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-4 h-4 text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.5)]" />
                      Control
                    </div>
                  </Link>
                  <Link
                    to="/scripts"
                    state={{ selectedRobot: robot.id }}
                    onClick={() => haptic.impact("light")}
                    className="flex-1 py-2.5 rounded-xl text-center transition-all font-medium text-sm bg-primary/10 border border-primary/20 text-primary/95 hover:bg-primary/20 hover:border-primary/40 hover:border-[#39ff14]/40 shadow-[0_0_8px_rgba(0,229,255,0.1)] hover:shadow-[0_0_12px_rgba(57,255,20,0.2)] group/scripts"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 text-primary/80 drop-shadow-[0_0_4px_rgba(0,229,255,0.3)] group-hover/scripts:text-[#39ff14] group-hover/scripts:drop-shadow-[0_0_6px_rgba(57,255,20,0.6)] transition-all" />
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
