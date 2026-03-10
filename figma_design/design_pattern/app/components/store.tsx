import { useState } from "react";
import { Bot, X } from "lucide-react";

interface StoreRobot {
  id: string;
  name: string;
  model: string;
  description: string;
  specs: string[];
  price?: string;
}

export function Store() {
  const [selectedRobot, setSelectedRobot] = useState<StoreRobot | null>(null);

  const storeRobots: StoreRobot[] = [
    {
      id: "model-x",
      name: "Robot Model X",
      model: "Model X",
      description:
        "Versatile service robot with advanced navigation and interaction capabilities.",
      specs: [
        "Autonomous navigation",
        "Voice interaction",
        "6-hour battery life",
        "Indoor/outdoor capable",
      ],
    },
    {
      id: "model-y",
      name: "Robot Model Y",
      model: "Model Y",
      description:
        "Compact delivery robot optimized for indoor environments and retail spaces.",
      specs: [
        "Compact design",
        "Cargo capacity: 10kg",
        "8-hour battery life",
        "Collision avoidance",
      ],
    },
    {
      id: "model-z",
      name: "Robot Model Z",
      model: "Model Z",
      description:
        "Heavy-duty robot for warehouse and inventory management scenarios.",
      specs: [
        "High payload capacity",
        "RFID scanning",
        "12-hour battery life",
        "Multi-floor navigation",
      ],
    },
    {
      id: "model-w",
      name: "Robot Model W",
      model: "Model W",
      description:
        "Customer service robot with interactive display and multilingual support.",
      specs: [
        "Touch display interface",
        "15+ languages",
        "10-hour battery life",
        "Facial recognition",
      ],
    },
  ];

  const handleAcquire = (robot: StoreRobot) => {
    alert(`Acquired ${robot.name}! Check your Robots page.`);
    setSelectedRobot(null);
  };

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">Robot Store</h1>

        <div className="grid grid-cols-2 gap-4">
          {storeRobots.map((robot) => (
            <button
              key={robot.id}
              onClick={() => setSelectedRobot(robot)}
              className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 hover:border-primary/30 transition-all text-left group shadow-lg flex flex-col h-full"
            >
              <div className="aspect-square bg-[#1f1f22] border border-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:border-primary/20 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bot className="w-12 h-12 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)] transition-transform group-hover:scale-110" />
              </div>
              <h4 className="font-semibold text-white tracking-tight mb-1 text-[15px]">{robot.name}</h4>
              <p className="text-[12px] text-[#a0a0a0] line-clamp-2 leading-relaxed mt-auto">
                {robot.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedRobot && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 transition-opacity"
          onClick={() => setSelectedRobot(null)}
        >
          <div
            className="bg-[#0a0a0c] w-full max-w-2xl rounded-t-[2rem] p-6 max-h-[85vh] overflow-y-auto border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{selectedRobot.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1f1f22] border border-white/5 rounded-md">
                   <span className="text-[12px] font-semibold text-primary uppercase tracking-wider">
                     {selectedRobot.model}
                   </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRobot(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-gradient-to-br from-[#1f1f22] to-[#111111] border border-white/5 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.1)_0%,transparent_70%)]" />
              <Bot className="w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.6)] relative z-10" />
            </div>

            <div className="mb-8">
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">Description</h3>
              <p className="text-[#a0a0a0] leading-relaxed text-[15px]">
                {selectedRobot.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">Specifications</h3>
              <ul className="space-y-3">
                {selectedRobot.specs.map((spec, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[#a0a0a0] text-[15px]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,229,255,0.8)]" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleAcquire(selectedRobot)}
              className="w-full py-4 bg-primary text-black font-bold text-[16px] rounded-xl hover:bg-[#33e8ff] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
            >
              Acquire Robot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
