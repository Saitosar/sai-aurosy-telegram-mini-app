import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Play, Square, ChevronDown, Bot } from "lucide-react";
import type { Robot } from "shared";
import { getRobots } from "../../api/robots";
import {
  runScenario,
  getExecutionStatus,
  stopExecution,
} from "../../api/scenarios";
import { Skeleton } from "../../components/ui/Skeleton";
import { MallGuideSimulationView } from "./MallGuideSimulationView";

const SCENARIO_ID = "mall-guide";

export function MallGuideScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedRobot = (location.state as { selectedRobot?: string })?.selectedRobot;

  const handleBack = useCallback(() => navigate(-1), [navigate]);

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
            onClick?: (cb: () => void) => () => void;
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
      const offClick = tg.BackButton.onClick?.(onBackPress);
      return () => {
        offClick?.();
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
    setStartError(null);
    try {
      const exec = await runScenario(SCENARIO_ID, { robotId: selectedRobot });
      setExecutionId(exec.id);
      setExecutionStatus({
        status: exec.status,
        currentWaypoint: exec.currentWaypoint ?? 1,
        totalWaypoints: exec.totalWaypoints ?? 5,
        progress: exec.progress ?? 0,
      });
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Failed to start scenario");
    }
    setIsSimulationActive(true);
  };

  const handleSimulationBack = useCallback(() => {
    setIsSimulationActive(false);
  }, []);

  const handleStop = async () => {
    if (!executionId || !executionStatus) return;
    const waypoint = executionStatus.currentWaypoint ?? 0;
    const total = executionStatus.totalWaypoints ?? 5;
    try {
      await stopExecution(SCENARIO_ID, executionId);
      setFinalStatus({ status: "stopped", currentWaypoint: waypoint, totalWaypoints: total });
      setExecutionId(null);
      setExecutionStatus(null);
      setTimeout(() => setFinalStatus(null), 2500);
    } catch {
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
        <div className="px-6 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#a0a0a0] mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-[15px]">Back</span>
          </button>
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 mb-6">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 relative">
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
      <div className="px-6 py-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#a0a0a0] mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-[15px]">Back</span>
        </button>
        <div className="flex items-center gap-4 mb-8">
          <div className="glass-icon-container p-3.5 rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <MapPin className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">Mall Guide</h1>
            <p className="text-[#a0a0a0] text-sm font-medium">Customer guidance scenario</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">About</h3>
          <p className="text-[#a0a0a0] leading-relaxed text-[14px]">
            Guide customers through the mall with predefined waypoints. The robot will navigate between key locations
            and provide assistance.
          </p>
        </div>

        <div className={`glass-card rounded-2xl p-6 mb-6 ${showDropdown ? "relative z-10" : ""}`}>
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Select Robot</h3>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={loading}
              className="glass-icon-container w-full px-4 py-3.5 rounded-xl flex items-center justify-between text-white hover:border-white/10 transition-colors disabled:opacity-50"
            >
              {selectedRobotData ? (
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[15px]">
                    {selectedRobotData.name}{" "}
                    <span className="text-[#666] mx-1">•</span>{" "}
                    <span className="text-[#a0a0a0]">{selectedRobotData.model}</span>
                  </span>
                </div>
              ) : (
                <span className="text-[#666] font-medium">
                  {loading ? "Loading..." : "Choose a robot"}
                </span>
              )}
              <ChevronDown className={`w-5 h-5 text-[#666] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 glass-card-elevated rounded-xl overflow-hidden z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                {robots.map((robot) => (
                  <button
                    key={robot.id}
                    onClick={() => {
                      setSelectedRobot(robot.id);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3.5 hover:bg-white/5 text-left flex items-center justify-between transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Bot
                        className={`w-5 h-5 ${robot.status === "online" ? "text-primary" : "text-[#666]"}`}
                      />
                      <span className="text-white font-medium text-[15px]">
                        {robot.name}{" "}
                        <span className="text-[#666] mx-1">•</span>{" "}
                        <span className="text-[#a0a0a0]">{robot.model}</span>
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        robot.status === "online" ? "bg-primary shadow-[0_0_5px_rgba(0,229,255,0.8)]" : "bg-[#333]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {startError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {startError}
          </div>
        )}

        {(isRunning || finalStatus) && (
          <div
            className={`mb-8 rounded-2xl p-6 relative z-0 overflow-hidden ${
              finalStatus?.status === "error"
                  ? "bg-red-500/10 border border-red-500/30"
                  : finalStatus?.status === "stopped"
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : finalStatus?.status === "completed"
                      ? "bg-[#39ff14]/10 border border-[#39ff14]/40 shadow-[0_0_20px_rgba(57,255,20,0.15)]"
                      : "glass-card border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
            }`}
          >
            {isRunning && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            )}
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4 relative z-10">
              Status
            </h3>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[#a0a0a0] text-sm font-medium">
                {statusLabel ?? "—"}
              </span>
              <span
                className={`font-bold text-sm tracking-wide ${
                  finalStatus?.status === "error"
                    ? "text-red-400"
                    : finalStatus?.status === "completed"
                      ? "text-[#39ff14]"
                      : "text-primary"
                }`}
              >
                Waypoint {currentWaypoint}/{totalWaypoints}
              </span>
            </div>
            <div className="glass-icon-container w-full rounded-full h-2.5 relative z-10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  finalStatus?.status === "error"
                    ? "bg-red-500"
                    : finalStatus?.status === "completed"
                      ? "bg-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.8)]"
                      : "bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                }`}
                style={{ width: `${((currentWaypoint ?? 0) / (totalWaypoints || 1)) * 100}%` }}
              />
            </div>
            {finalStatus?.status === "error" && (
              <p className="mt-4 text-red-400 text-sm relative z-10">
                Scenario encountered an error. You can start again.
              </p>
            )}
          </div>
        )}

        {!isRunning && !finalStatus && (
          <div className="mb-8 glass-card rounded-2xl p-4 relative z-0">
            <p className="text-[#a0a0a0] text-sm font-medium">Ready to start</p>
          </div>
        )}

        <div className="space-y-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!selectedRobot || loading}
              className="w-full py-4 bg-primary text-black font-bold text-[16px] rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#33e8ff] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
            >
              <Play className="w-5 h-5 fill-black" />
              Start Mall Guide
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 font-bold text-[16px] rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <Square className="w-5 h-5 fill-red-500" />
              Stop Mall Guide
            </button>
          )}

          {selectedRobot && (
            <Link
              to={`/control/${selectedRobot}`}
              state={
                executionId
                  ? { executionId, scenarioId: SCENARIO_ID }
                  : { selectedRobot }
              }
              className="glass-button-secondary block w-full py-4 hover:bg-white/10 text-white font-semibold text-[16px] rounded-xl text-center transition-all"
            >
              Open Control Panel
            </Link>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
