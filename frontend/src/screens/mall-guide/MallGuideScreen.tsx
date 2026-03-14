import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, ChevronDown, Bot } from "lucide-react";
import type { Robot } from "shared";
import { getRobots } from "../../api/robots";
import { haptic } from "../../utils/haptic";
import {
  runScenario,
  getExecutionStatus,
  stopExecution,
} from "../../api/scenarios";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Skeleton } from "../../components/ui/Skeleton";
import { MallGuideSimulationView } from "./MallGuideSimulationView";

const SCENARIO_ID = "mall-guide";

export function MallGuideScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedRobot = (location.state as { selectedRobot?: string })?.selectedRobot;

  const handleBack = useCallback(() => {
    haptic.impact("light");
    navigate(-1);
  }, [navigate]);

  const [robots, setRobots] = useState<Robot[]>([]);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRobot, setSelectedRobot] = useState<string>(preselectedRobot ?? "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<{
    status: string;
    currentWaypoint?: number;
    totalWaypoints?: number;
    progress?: number;
  } | null>(null);
  const [finalStatus, setFinalStatus] = useState<{
    status: string;
    currentWaypoint?: number;
    totalWaypoints?: number;
  } | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const isRunning =
    executionId &&
    executionStatus &&
    executionStatus.status === "running";

  const currentWaypoint = executionStatus?.currentWaypoint ?? finalStatus?.currentWaypoint ?? 0;
  const totalWaypoints = executionStatus?.totalWaypoints ?? finalStatus?.totalWaypoints ?? 5;

  const statusLabel =
    executionStatus?.status === "running"
      ? "Running"
      : executionStatus?.status === "completed"
        ? "Completed"
        : executionStatus?.status === "stopped"
          ? "Stopped"
          : executionStatus?.status === "error"
            ? "Error"
            : finalStatus?.status === "completed"
              ? "Completed"
              : finalStatus?.status === "stopped"
                ? "Stopped"
                : finalStatus?.status === "error"
                  ? "Error"
                  : null;

  useEffect(() => {
    getRobots()
      .then(setRobots)
      .catch(() => setRobots([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tg = (window as unknown as {
      Telegram?: {
        WebApp?: {
          BackButton?: {
            show?: () => void;
            hide?: () => void;
            onClick?: (cb: () => void) => void;
            offClick?: (cb: () => void) => void;
          };
        };
      };
    }).Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.show?.();
      const onBackPress = () => {
        if (isSimulationActive) {
          setIsSimulationActive(false);
        } else {
          handleBack();
        }
      };
      tg.BackButton.onClick?.(onBackPress);
      return () => {
        tg.BackButton?.offClick?.(onBackPress);
        tg.BackButton?.hide?.();
      };
    }
  }, [handleBack, isSimulationActive]);

  useEffect(() => {
    if (!executionId) return;
    const interval = setInterval(async () => {
      try {
        const exec = await getExecutionStatus(SCENARIO_ID, executionId);
        const status = exec.status;
        setExecutionStatus({
          status,
          currentWaypoint: exec.currentWaypoint,
          totalWaypoints: exec.totalWaypoints,
          progress: exec.progress,
        });
        if (status === "completed" || status === "stopped" || status === "error") {
          setFinalStatus({
            status,
            currentWaypoint: exec.currentWaypoint,
            totalWaypoints: exec.totalWaypoints,
          });
          setExecutionId(null);
          setExecutionStatus(null);
          setTimeout(() => setFinalStatus(null), 2500);
        }
      } catch {
        // Ignore poll errors
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [executionId]);

  const handleStart = async () => {
    if (!selectedRobot) {
      setStartError("Please select a robot first");
      return;
    }
    haptic.impact("medium");
    setStartError(null);
    try {
      const exec = await runScenario(SCENARIO_ID, { robotId: selectedRobot });
      haptic.success();
      setExecutionId(exec.id);
      setExecutionStatus({
        status: exec.status,
        currentWaypoint: exec.currentWaypoint ?? 1,
        totalWaypoints: exec.totalWaypoints ?? 5,
        progress: exec.progress ?? 0,
      });
    } catch (err) {
      haptic.error();
      setStartError(err instanceof Error ? err.message : "Failed to start scenario");
    }
    setIsSimulationActive(true);
  };

  const handleSimulationBack = useCallback(() => {
    setIsSimulationActive(false);
  }, []);

  const handleStop = async () => {
    if (!executionId || !executionStatus) return;
    haptic.impact("medium");
    const waypoint = executionStatus.currentWaypoint ?? 0;
    const total = executionStatus.totalWaypoints ?? 5;
    try {
      await stopExecution(SCENARIO_ID, executionId);
      haptic.success();
      setFinalStatus({ status: "stopped", currentWaypoint: waypoint, totalWaypoints: total });
      setExecutionId(null);
      setExecutionStatus(null);
      setTimeout(() => setFinalStatus(null), 2500);
    } catch {
      haptic.error();
      setFinalStatus({ status: "error", currentWaypoint: waypoint, totalWaypoints: total });
      setExecutionId(null);
      setExecutionStatus(null);
      setTimeout(() => setFinalStatus(null), 2500);
    }
  };

  const selectedRobotData = robots.find((r) => r.id === selectedRobot);

  if (loading) {
    return (
      <div className="min-h-full pb-20">
        <div className="px-4 sm:px-6 py-8">
          <ScreenHeader
            title="Mall Guide"
            subtitle="Customer guidance scenario"
            onBack={handleBack}
            className="mb-8"
          />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="flex-1">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 mb-6">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="glass-card rounded-3xl p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <AnimatePresence>
        {isSimulationActive && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MallGuideSimulationView onBack={handleSimulationBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isSimulationActive && (
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <ScreenHeader
          title="Mall Guide"
          subtitle="Customer guidance scenario"
          onBack={handleBack}
          className="mb-8"
        />

        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-[13px] font-semibold text-foreground mb-3">About</h3>
          <p className="text-muted-foreground leading-relaxed text-[14px]">
            Guide customers through the mall with predefined waypoints. The robot will navigate between key locations
            and provide assistance.
          </p>
        </div>

        <div className={`glass-card-elevated rounded-3xl p-6 mb-6 ${showDropdown ? "relative z-10" : ""}`}>
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Select Robot</h3>
          <div className="relative">
            <motion.button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={loading}
              className="glass-icon-container w-full min-h-[44px] px-4 py-3.5 rounded-2xl flex items-center justify-between text-foreground hover:bg-muted/30 transition-colors disabled:opacity-50"
              whileTap={loading ? undefined : { scale: 0.98 }}
            >
              {selectedRobotData ? (
                <div className="flex items-center gap-4">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[15px]">
                    {selectedRobotData.name}{" "}
                    <span className="text-muted-foreground mx-1">•</span>{" "}
                    <span className="text-muted-foreground">{selectedRobotData.model}</span>
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground font-medium">
                  {loading ? "Loading..." : "Choose a robot"}
                </span>
              )}
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </motion.button>

            {showDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 glass-card-elevated rounded-2xl overflow-hidden z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                {robots.map((robot) => (
                  <motion.button
                    key={robot.id}
                    onClick={() => {
                      haptic.selection();
                      setSelectedRobot(robot.id);
                      setShowDropdown(false);
                    }}
                    className="w-full min-h-[44px] px-4 py-3.5 hover:bg-white/5 text-left flex items-center justify-between transition-colors border-b border-white/5 last:border-0"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <Bot
                        className={`w-5 h-5 ${robot.status === "online" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-foreground font-medium text-[15px]">
                        {robot.name}{" "}
                        <span className="text-muted-foreground mx-1">•</span>{" "}
                        <span className="text-muted-foreground">{robot.model}</span>
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        robot.status === "online" ? "bg-[var(--status-online)]" : "bg-[var(--status-offline)]"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {startError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
            {startError}
          </div>
        )}

        {(isRunning || finalStatus) && (
          <div
            className={`mb-8 rounded-3xl p-6 relative z-0 overflow-hidden ${
              finalStatus?.status === "error"
                  ? "bg-[var(--status-error)]/10 border border-[var(--status-error)]/30"
                  : finalStatus?.status === "stopped"
                    ? "bg-[var(--status-warning)]/10 border border-[var(--status-warning)]/30"
                    : finalStatus?.status === "completed"
                      ? "bg-[var(--status-busy)]/10 border border-[var(--status-busy)]/30"
                      : "glass-card"
            }`}
          >
            <h3 className="text-[13px] font-semibold text-foreground mb-4 relative z-10">
              Status
            </h3>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-muted-foreground text-sm font-medium">
                {statusLabel ?? "—"}
              </span>
              <span
                className={`font-bold text-sm tracking-wide ${
                  finalStatus?.status === "error"
                    ? "text-[var(--status-error)]"
                    : finalStatus?.status === "completed"
                      ? "text-[var(--status-busy)]"
                      : "text-[var(--status-online)]"
                }`}
              >
                Waypoint {currentWaypoint}/{totalWaypoints}
              </span>
            </div>
            <div className="glass-icon-container w-full rounded-full h-2.5 relative z-10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  finalStatus?.status === "error"
                    ? "bg-[var(--status-error)]"
                    : finalStatus?.status === "completed"
                      ? "bg-[var(--status-busy)]"
                      : "bg-[var(--status-online)]"
                }`}
                style={{ width: `${((currentWaypoint ?? 0) / (totalWaypoints || 1)) * 100}%` }}
              />
            </div>
            {finalStatus?.status === "error" && (
              <p className="mt-4 text-[var(--status-error)] text-sm relative z-10">
                Scenario encountered an error. You can start again.
              </p>
            )}
          </div>
        )}

        {!isRunning && !finalStatus && (
          <div className="mb-8 glass-card rounded-3xl p-4 sm:p-6 relative z-0">
            <p className="text-muted-foreground text-sm font-medium">Ready to start</p>
          </div>
        )}

        <div className="space-y-4">
          {!isRunning ? (
            <motion.button
              onClick={handleStart}
              disabled={!selectedRobot || loading}
              className="w-full min-h-[44px] py-4 bg-primary text-primary-foreground font-medium text-base rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              whileTap={!selectedRobot || loading ? undefined : { scale: 0.98 }}
            >
              <Play className="w-5 h-5 fill-black" />
              Start Mall Guide
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStop}
              className="w-full min-h-[44px] py-4 bg-red-500/10 text-red-500 border border-red-500/30 font-medium text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <Square className="w-5 h-5 fill-red-500" />
              Stop Mall Guide
            </motion.button>
          )}

          {selectedRobot && (
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to={`/control/${selectedRobot}`}
                state={
                  executionId
                    ? { executionId, scenarioId: SCENARIO_ID }
                    : { selectedRobot }
                }
                onClick={() => haptic.impact("light")}
                className="glass-button-secondary block w-full min-h-[44px] py-4 hover:bg-muted/50 text-foreground font-medium text-base rounded-2xl text-center transition-colors"
              >
                Open Control Panel
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
