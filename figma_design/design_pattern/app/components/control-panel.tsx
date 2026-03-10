import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Bot, Battery, MapPin, Square, Home, Zap } from "lucide-react";

export function ControlPanel() {
  const { robotId } = useParams();
  const navigate = useNavigate();
  const [isRunningScenario, setIsRunningScenario] = useState(false);

  const robotData = {
    "robot-a": {
      name: "Robot A",
      model: "Model X",
      status: "online",
      position: { x: 12.5, y: 8.3 },
      battery: 85,
      scenario: isRunningScenario ? "Mall Guide" : null,
    },
    "robot-b": {
      name: "Robot B",
      model: "Model Y",
      status: "offline",
      position: { x: 0, y: 0 },
      battery: 45,
      scenario: null,
    },
    "robot-c": {
      name: "Store Bot",
      model: "Model Z",
      status: "busy",
      position: { x: 23.1, y: 15.7 },
      battery: 92,
      scenario: "Inventory Scan",
    },
  };

  const robot = robotData[robotId as keyof typeof robotData];

  if (!robot) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Robot not found</h2>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "busy":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleStopScenario = () => {
    setIsRunningScenario(false);
  };

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#a0a0a0] mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-[15px]">Back</span>
        </button>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
          {robot.status === 'online' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          )}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-[#1f1f22] rounded-xl border border-white/5">
                <Bot className={`w-7 h-7 ${robot.status === 'online' ? 'text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : 'text-[#666]'}`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold tracking-tight text-white">{robot.name}</h2>
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-black/40 rounded-full border border-white/5">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        robot.status
                      )}`}
                    />
                    <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wider">
                      {robot.status}
                    </span>
                  </div>
                </div>
                <p className="text-[#a0a0a0] text-sm font-medium">{robot.model}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-5">Telemetry</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#a0a0a0]">
                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-[15px]">Position</span>
              </div>
              <span className="font-mono text-white text-[15px] bg-[#1f1f22] px-3 py-1 rounded-lg border border-white/5">
                X: {robot.position.x}, Y: {robot.position.y}
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
                  <div className={`h-full rounded-full ${robot.battery > 20 ? 'bg-primary shadow-[0_0_8px_rgba(0,229,255,0.6)]' : 'bg-red-500'}`} style={{ width: `${robot.battery}%` }} />
                </div>
                <span className="font-mono text-white text-[15px] bg-[#1f1f22] px-3 py-1 rounded-lg border border-white/5">{robot.battery}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-5">Commands</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-3.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all font-semibold">
              <Square className="w-4 h-4 fill-red-500" />
              Stop
            </button>
            <button className="px-4 py-3.5 bg-[#1f1f22] hover:bg-[#2a2a2e] border border-white/5 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold">
              <Home className="w-4 h-4 text-primary" />
              Go Home
            </button>
            <button className="px-4 py-3.5 bg-[#1f1f22] hover:bg-[#2a2a2e] border border-white/5 text-white rounded-xl flex items-center justify-center gap-2 col-span-2 transition-all font-semibold">
              <Zap className="w-4 h-4 text-primary" />
              Custom Command
            </button>
          </div>
        </div>

        {robot.scenario ? (
          <div className="bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 mb-6 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <h3 className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-2">Active Scenario</h3>
            <p className="text-white font-medium mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
              Running: {robot.scenario}
            </p>
            <button
              onClick={handleStopScenario}
              className="w-full px-4 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/20 transition-all"
            >
              Stop Scenario
            </button>
          </div>
        ) : (
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-2">Start Scenario</h3>
            <p className="text-[#a0a0a0] mb-5 text-[14px]">
              Launch the Mall Guide scenario on this robot
            </p>
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
