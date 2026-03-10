import { useState } from "react";
import { Link } from "react-router";
import { Bot, Plus, Power, Play } from "lucide-react";

interface Robot {
  id: string;
  name: string;
  model: string;
  status: "online" | "offline" | "busy";
  scenario?: string;
}

export function Robots() {
  const [robots] = useState<Robot[]>([
    {
      id: "robot-a",
      name: "Robot A",
      model: "Model X",
      status: "online",
      scenario: "Mall Guide",
    },
    {
      id: "robot-b",
      name: "Robot B",
      model: "Model Y",
      status: "offline",
    },
    {
      id: "robot-c",
      name: "Store Bot",
      model: "Model Z",
      status: "busy",
      scenario: "Inventory Scan",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-primary shadow-[0_0_8px_rgba(0,229,255,0.8)]";
      case "offline":
        return "bg-[#333]";
      case "busy":
        return "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-full">
      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">My Robots</h1>
          <button className="p-2.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {robots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111111]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-[#1f1f22] rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <Bot className="w-8 h-8 text-[#555]" />
            </div>
            <h3 className="mb-2 text-white font-semibold">No robots deployed</h3>
            <p className="text-[#a0a0a0] mb-8 max-w-[200px] text-sm">
              Connect your first unit or browse models in the Store.
            </p>
            <Link
              to="/store"
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
                className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group shadow-lg relative overflow-hidden"
              >
                {/* Glow effect behind the robot */}
                {robot.status === 'online' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                )}
                
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#1f1f22] rounded-xl border border-white/5">
                      <Bot className={`w-6 h-6 ${robot.status === 'online' ? 'text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]' : 'text-[#666]'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white tracking-tight text-[17px]">{robot.name}</h3>
                      </div>
                      <p className="text-[13px] text-[#a0a0a0] font-medium">
                        {robot.model}
                      </p>
                      {robot.scenario && (
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                           <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                             Running: {robot.scenario}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-black/40 rounded-full border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)}`} />
                    <span className="text-[11px] text-[#a0a0a0] font-medium uppercase tracking-wider">
                      {getStatusText(robot.status)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10">
                  <Link
                    to={`/control/${robot.id}`}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-center border border-white/5 transition-colors font-medium text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-4 h-4 text-primary" />
                      Control
                    </div>
                  </Link>
                  <Link
                    to="/scenarios/mall-guide"
                    state={{ selectedRobot: robot.id }}
                    className="flex-1 py-2.5 bg-[#1f1f22] hover:bg-[#2a2a2e] text-white rounded-xl text-center border border-white/5 transition-colors font-medium text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 text-[#a0a0a0]" />
                      Guide
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
