import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Bot, Battery, MapPin, Square, Home, Zap } from "lucide-react";
import type { RobotDetail } from "shared";
import { getRobot, sendCommand } from "../../api/robots";
import { stopExecution } from "../../api/scenarios";
import { useTelemetry } from "../../hooks/useTelemetry";

export function ControlScreen() {
  const { robotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleBack = () => navigate(-1);

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

  const handleCommand = async (command: string) => {
    if (!robotId || commandPending) return;
    setCommandPending(true);
    setCommandError(null);
    setCommandSuccess(false);
    try {
      await sendCommand(robotId, { command });
      setCommandSuccess(true);
      setTimeout(() => setCommandSuccess(false), 3000);
    } catch (err) {
      setCommandError(err instanceof Error ? err.message : "Command failed");
    } finally {
      setCommandPending(false);
    }
  };

  const handleStop = () => handleCommand("safe_stop");
  const handleGoHome = () => handleCommand("go_home");

  const handleStopScenario = async () => {
    if (!executionId || scenarioStopped) return;
    setScenarioStopError(null);
    try {
      await stopExecution(scenarioId, executionId);
      setScenarioStopped(true);
    } catch (err) {
      setScenarioStopError(err instanceof Error ? err.message : "Failed to stop scenario");
    }
  };

  const displayScenario = robot?.scenario ?? (executionId && !scenarioStopped ? "Mall Guide" : null);
  const showScenarioStopped = scenarioStopped || (executionId && !displayScenario);
  const position = telemetry?.position ?? robot?.position ?? { x: 0, y: 0 };
  const battery = telemetry?.battery ?? robot?.battery ?? 0;
  const displayRobot = robot ?? (telemetry ? { id: robotId!, name: "Robot", model: "", status: telemetry.status as "online" | "offline" | "busy" | "error" } : null);

  if (!robotId) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-white">Robot not found</h2>
          <Link
            to="/robots"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg inline-block"
          >
            Back to Robots
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !displayRobot) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-[#a0a0a0] text-sm">Loading robot...</div>
      </div>
    );
  }

  if (error && !displayRobot) {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center px-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <Link to="/robots" className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">
          Back to Robots
        </Link>
      </div>
    );
  }

  if (!displayRobot) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-white">Robot not found</h2>
          <Link
            to="/robots"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg inline-block"
          >
            Back to Robots
          </Link>
        </div>
      </div>
    );
  }

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

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
          {displayRobot.status === "online" && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          )}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-[#1f1f22] rounded-xl border border-white/5">
                <Bot
                  className={`w-7 h-7 ${displayRobot.status === "online" ? "text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" : "text-[#666]"}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold tracking-tight text-white">{displayRobot.name}</h2>
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-black/40 rounded-full border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(displayRobot.status)}`} />
                    <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wider">
                      {displayRobot.status}
                    </span>
                  </div>
                </div>
                <p className="text-[#a0a0a0] text-sm font-medium">{displayRobot.model}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider">Telemetry</h3>
            {lastUpdated && (
              <span
                className={`text-[11px] font-medium ${
                  isStale ? "text-amber-500" : "text-[#a0a0a0]"
                }`}
                title={lastUpdated.toLocaleTimeString()}
              >
                {isStale ? "Data may be outdated" : `Updated ${Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago`}
              </span>
            )}
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#a0a0a0]">
                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-[15px]">Position</span>
              </div>
              <span className="font-mono text-white text-[15px] bg-[#1f1f22] px-3 py-1 rounded-lg border border-white/5">
                X: {position.x}, Y: {position.y}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#a0a0a0]">
                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <Battery className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-[15px]">Battery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-[#1f1f22] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full ${battery > 80 ? "bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.6)]" : battery > 20 ? "bg-primary shadow-[0_0_8px_rgba(0,229,255,0.6)]" : "bg-red-500"}`}
                    style={{ width: `${battery}%` }}
                  />
                </div>
                <span className="font-mono text-white text-[15px] bg-[#1f1f22] px-3 py-1 rounded-lg border border-white/5">
                  {battery}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-5">Commands</h3>
          {(commandError || commandSuccess) && (
            <div
              className={`mb-4 px-4 py-2 rounded-xl text-sm font-medium ${
                commandError ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/40 shadow-[0_0_8px_rgba(57,255,20,0.2)]"
              }`}
            >
              {commandError ?? "Command sent"}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleStop}
              disabled={commandPending}
              className="px-4 py-3.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-semibold disabled:opacity-50"
            >
              <Square className="w-4 h-4 fill-red-500" />
              Stop
            </button>
            <button
              onClick={handleGoHome}
              disabled={commandPending}
              className="px-4 py-3.5 bg-[#1f1f22] hover:bg-[#2a2a2e] border border-white/5 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold disabled:opacity-50"
            >
              <Home className="w-4 h-4 text-primary" />
              Go Home
            </button>
            <button
              disabled
              title="Coming when platform supports custom commands"
              className="px-4 py-3.5 bg-[#1f1f22] hover:bg-[#2a2a2e] border border-white/5 text-white rounded-xl flex items-center justify-center gap-2 col-span-2 transition-all font-semibold opacity-50 cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-primary" />
              Custom Command
            </button>
          </div>
        </div>

        {displayScenario ? (
          <div className="bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 mb-6 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <h3 className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-2">Active Scenario</h3>
            <p className="text-white font-medium mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
              Running: {displayScenario}
            </p>
            {scenarioStopError && (
              <p className="mb-4 text-red-400 text-sm">{scenarioStopError}</p>
            )}
            <button
              onClick={handleStopScenario}
              className="w-full px-4 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/20 transition-all"
            >
              Stop Scenario
            </button>
          </div>
        ) : showScenarioStopped ? (
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-2">Scenario</h3>
            <p className="text-[#a0a0a0] mb-5 text-[14px]">Scenario stopped</p>
            <Link
              to="/scenarios/mall-guide"
              state={{ selectedRobot: robotId }}
              className="block w-full px-4 py-4 bg-primary text-black rounded-xl text-center font-bold hover:bg-[#33e8ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
            >
              Start Mall Guide
            </Link>
          </div>
        ) : (
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-2">Start Scenario</h3>
            <p className="text-[#a0a0a0] mb-5 text-[14px]">Launch the Mall Guide scenario on this robot</p>
            <Link
              to="/scenarios/mall-guide"
              state={{ selectedRobot: robotId }}
              className="block w-full px-4 py-4 bg-primary text-black rounded-xl text-center font-bold hover:bg-[#33e8ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
            >
              Start Mall Guide
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
