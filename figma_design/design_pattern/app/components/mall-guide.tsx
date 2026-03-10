import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { MapPin, Play, Square, ChevronDown, Bot } from "lucide-react";

export function MallGuide() {
  const location = useLocation();
  const preselectedRobot = location.state?.selectedRobot;

  const [selectedRobot, setSelectedRobot] = useState<string>(
    preselectedRobot || ""
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const robots = [
    { id: "robot-a", name: "Robot A", model: "Model X", status: "online" },
    { id: "robot-b", name: "Robot B", model: "Model Y", status: "offline" },
    { id: "robot-c", name: "Store Bot", model: "Model Z", status: "online" },
  ];

  const totalWaypoints = 5;

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentWaypoint((prev) => {
          if (prev >= totalWaypoints) {
            setIsRunning(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleStart = () => {
    if (!selectedRobot) {
      alert("Please select a robot first");
      return;
    }
    setIsRunning(true);
    setCurrentWaypoint(1);
  };

  const handleStop = () => {
    setIsRunning(false);
    setCurrentWaypoint(0);
  };

  const selectedRobotData = robots.find((r) => r.id === selectedRobot);

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-[#1f1f22] border border-white/5 rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <MapPin className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">Mall Guide</h1>
            <p className="text-[#a0a0a0] text-sm font-medium">
              Customer guidance scenario
            </p>
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">About</h3>
          <p className="text-[#a0a0a0] leading-relaxed text-[14px]">
            Guide customers through the mall with predefined waypoints. The
            robot will navigate between key locations and provide assistance.
          </p>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Select Robot</h3>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-3.5 bg-[#1f1f22] border border-white/5 rounded-xl flex items-center justify-between text-white hover:border-white/10 transition-colors shadow-inner"
            >
              {selectedRobotData ? (
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="font-medium text-[15px]">
                    {selectedRobotData.name} <span className="text-[#666] mx-1">•</span> <span className="text-[#a0a0a0]">{selectedRobotData.model}</span>
                  </span>
                </div>
              ) : (
                <span className="text-[#666] font-medium">Choose a robot</span>
              )}
              <ChevronDown className={`w-5 h-5 text-[#666] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1f1f22] border border-white/10 rounded-xl overflow-hidden z-20 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
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
                      <Bot className={`w-5 h-5 ${robot.status === 'online' ? 'text-primary' : 'text-[#666]'}`} />
                      <span className="text-white font-medium text-[15px]">
                        {robot.name} <span className="text-[#666] mx-1">•</span> <span className="text-[#a0a0a0]">{robot.model}</span>
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        robot.status === "online"
                          ? "bg-primary shadow-[0_0_5px_rgba(0,229,255,0.8)]"
                          : "bg-[#333]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isRunning && (
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 mb-8 shadow-[0_0_20px_rgba(0,229,255,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4 relative z-10">Status</h3>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[#a0a0a0] text-sm font-medium">Progress</span>
              <span className="text-primary font-bold text-sm tracking-wide">
                Waypoint {currentWaypoint}/{totalWaypoints}
              </span>
            </div>
            <div className="w-full bg-[#1f1f22] rounded-full h-2.5 relative z-10 overflow-hidden border border-white/5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                style={{
                  width: `${(currentWaypoint / totalWaypoints) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!selectedRobot}
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
              className="block w-full py-4 bg-[#1f1f22] hover:bg-[#2a2a2e] border border-white/5 text-white font-semibold text-[16px] rounded-xl text-center transition-all"
            >
              Open Control Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
