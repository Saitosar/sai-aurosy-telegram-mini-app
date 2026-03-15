import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Hand, Square, Home, Zap } from "lucide-react";
import type { RobotDetail } from "shared";
import { getRobot, sendCommand } from "../../api/robots";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { InfoManageTabs, type ControlTab } from "../../components/ui/InfoManageTabs";
import { ManualControlView } from "../../components/control/ManualControlView";
import { RobotMetricsPanel } from "../../components/control/RobotMetricsPanel";
import { haptic } from "../../utils/haptic";
import { stopExecution } from "../../api/scenarios";
import { useTelemetry } from "../../hooks/useTelemetry";

function parseTabParam(value: string | null): ControlTab {
  if (value === "info" || value === "manage") return value;
  return "info";
}

export function ControlScreen() {
  const { robotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = parseTabParam(tabParam);

  const state = location.state as { executionId?: string; scenarioId?: string } | undefined;
  const executionId = state?.executionId;
  const scenarioId = state?.scenarioId ?? "mall-guide";

  const [robot, setRobot] = useState<RobotDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commandPending, setCommandPending] = useState(false);
  const [commandError, setCommandError] = useState<string | null>(null);
  const [commandSuccess, setCommandSuccess] = useState(false);
  const [scenarioStopped, setScenarioStopped] = useState(false);
  const [scenarioStopError, setScenarioStopError] = useState<string | null>(null);

  const { data: telemetry, lastUpdated, isStale } = useTelemetry(robotId);

  useEffect(() => {
    if (!robotId) {
      setLoading(false);
      return;
    }
    getRobot(robotId)
      .then(setRobot)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load robot"))
      .finally(() => setLoading(false));
  }, [robotId]);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { BackButton?: { show?: () => void; hide?: () => void } } } })
      .Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.show?.();
      return () => tg.BackButton?.hide?.();
    }
  }, []);

  const handleBack = () => {
    haptic.impact("light");
    navigate(-1);
  };

  const handleTabChange = (tab: ControlTab) => {
    setSearchParams({ tab }, { replace: true });
  };

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

  const handleCommand = async (command: string) => {
    if (!robotId || commandPending) return;
    haptic.impact("medium");
    setCommandPending(true);
    setCommandError(null);
    setCommandSuccess(false);
    try {
      await sendCommand(robotId, { command });
      haptic.success();
      setCommandSuccess(true);
      setTimeout(() => setCommandSuccess(false), 3000);
    } catch (err) {
      haptic.error();
      setCommandError(err instanceof Error ? err.message : "Command failed");
    } finally {
      setCommandPending(false);
    }
  };

  const handleStop = () => handleCommand("safe_stop");
  const handleGoHome = () => handleCommand("go_home");

  const handleStopScenario = async () => {
    if (!executionId || scenarioStopped) return;
    haptic.impact("medium");
    setScenarioStopError(null);
    try {
      await stopExecution(scenarioId, executionId);
      haptic.success();
      setScenarioStopped(true);
    } catch (err) {
      haptic.error();
      setScenarioStopError(err instanceof Error ? err.message : "Failed to stop scenario");
    }
  };

  const handleTakeManualControl = async () => {
    if (!robotId || commandPending) return;
    haptic.impact("medium");
    setCommandPending(true);
    setCommandError(null);
    setCommandSuccess(false);
    setScenarioStopError(null);
    try {
      if (displayScenario && executionId && !scenarioStopped) {
        await stopExecution(scenarioId, executionId);
        setScenarioStopped(true);
      }
      await sendCommand(robotId, { command: "release_control" });
      haptic.success();
      setCommandSuccess(true);
      setTimeout(() => setCommandSuccess(false), 3000);
      handleTabChange("manage");
    } catch (err) {
      haptic.error();
      setCommandError(err instanceof Error ? err.message : "Failed to take manual control");
    } finally {
      setCommandPending(false);
    }
  };

  const displayScenario = robot?.scenario ?? (executionId && !scenarioStopped ? "Mall Guide" : null);
  const showScenarioStopped = scenarioStopped || (executionId && !displayScenario);
  const displayRobot = robot ?? (telemetry ? { id: robotId!, name: "Robot", model: "", status: telemetry.status as "online" | "offline" | "busy" | "error" } : null);

  if (!robotId) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-foreground">Robot not found</h2>
          <Link
            to="/robots"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-3 bg-primary text-primary-foreground rounded-lg touch-target"
            aria-label="Back to Robots"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !displayRobot) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading robot...</div>
      </div>
    );
  }

  if (error && !displayRobot) {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center px-4 sm:px-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <Link
          to="/robots"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 bg-primary/20 text-primary rounded-lg touch-target"
          aria-label="Back to Robots"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (!displayRobot) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-foreground">Robot not found</h2>
          <Link
            to="/robots"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-3 bg-primary text-primary-foreground rounded-lg touch-target"
            aria-label="Back to Robots"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <ScreenHeader
          title={displayRobot.name}
          onBack={handleBack}
          className="mb-6"
        />

        <InfoManageTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="mb-6"
        />

        {activeTab === "info" && (
        <div
          id="control-info-panel"
          role="tabpanel"
          aria-labelledby="tab-info"
        >
        <div className="glass-card-elevated rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl glass-icon-container">
                <Bot
                  className={`w-7 h-7 ${displayRobot.status === "online" ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <div className="flex items-center gap-2 px-2 py-0.5 rounded-full glass-button-secondary">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(displayRobot.status)}`} />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {displayRobot.status}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-medium">{displayRobot.model}</p>
              </div>
            </div>
          </div>
        </div>

        <RobotMetricsPanel
          telemetry={telemetry}
          lastUpdated={lastUpdated}
          isStale={isStale}
        />

        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Manual control</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Stop automation and take control via joystick. Stops any running scenario.
          </p>
          <motion.button
            onClick={handleTakeManualControl}
            disabled={commandPending}
            className="w-full min-h-[44px] px-4 py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            whileTap={commandPending ? undefined : { scale: 0.98 }}
          >
            <Hand className="w-5 h-5" />
            <span>Take manual control</span>
          </motion.button>
        </div>

        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-[13px] font-semibold text-foreground mb-5">Commands</h3>
          {(commandError || commandSuccess) && (
            <div
              className={`mb-4 px-4 py-2 rounded-2xl text-sm font-medium ${
                commandError ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-toxic/10 text-toxic border border-toxic/30"
              }`}
            >
              {commandError ?? "Command sent"}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <motion.button
              onClick={handleStop}
              disabled={commandPending}
              className="px-4 py-4 min-h-[44px] bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-semibold disabled:opacity-50"
              whileTap={commandPending ? undefined : { scale: 0.98 }}
            >
              <Square className="w-4 h-4 fill-red-500" />
              Stop
            </motion.button>
            <motion.button
              onClick={handleGoHome}
              disabled={commandPending}
              className="px-4 py-4 min-h-[44px] glass-button-secondary text-primary hover:bg-muted/50 rounded-2xl flex items-center justify-center gap-2 transition-colors font-medium disabled:opacity-50"
              whileTap={commandPending ? undefined : { scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
            <button
              disabled
              title="Coming when platform supports custom commands"
              className="px-4 py-4 min-h-[44px] glass-button-secondary text-muted-foreground rounded-2xl flex items-center justify-center gap-2 col-span-2 font-medium opacity-50 cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-primary" />
              Custom Command
            </button>
          </div>
        </div>

        {displayScenario ? (
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h3 className="text-[13px] font-semibold text-foreground mb-2">Active Scenario</h3>
            <p className="text-foreground font-medium mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Running: {displayScenario}
            </p>
            {scenarioStopError && (
              <p className="mb-4 text-red-400 text-sm">{scenarioStopError}</p>
            )}
            <motion.button
              onClick={handleStopScenario}
              className="w-full min-h-[44px] px-4 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
              whileTap={{ scale: 0.98 }}
            >
              Stop Scenario
            </motion.button>
          </div>
        ) : showScenarioStopped ? (
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h3 className="text-[13px] font-semibold text-foreground mb-2">Scenario</h3>
            <p className="text-muted-foreground mb-5 text-[14px]">Scenario stopped</p>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/scripts/mall-guide"
                state={{ selectedRobot: robotId }}
                onClick={() => haptic.impact("light")}
                className="block w-full min-h-[44px] px-4 py-4 bg-primary text-primary-foreground rounded-2xl text-center font-medium hover:opacity-90 transition-opacity"
              >
                Start Mall Guide
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-[13px] font-semibold text-foreground mb-2">Start Scenario</h3>
            <p className="text-muted-foreground mb-5 text-[14px]">Launch the Mall Guide scenario on this robot</p>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/scripts/mall-guide"
                state={{ selectedRobot: robotId }}
                onClick={() => haptic.impact("light")}
                className="block w-full min-h-[44px] px-4 py-4 bg-primary text-primary-foreground rounded-2xl text-center font-medium hover:opacity-90 transition-opacity"
              >
                Start Mall Guide
              </Link>
            </motion.div>
          </div>
        )}
        </div>
        )}

        {activeTab === "manage" && (
          <ManualControlView
            robotId={robotId}
            commandPending={commandPending}
            commandError={commandError}
            onCommandSent={() => {
              setCommandSuccess(true);
              setTimeout(() => setCommandSuccess(false), 3000);
            }}
            onCommandError={setCommandError}
          />
        )}
      </div>
    </div>
  );
}
