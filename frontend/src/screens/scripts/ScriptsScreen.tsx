import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Mic, Layers, Plus } from "lucide-react";
import type { Scenario } from "shared";
import { getScenarios } from "../../api/scenarios";
import { Skeleton } from "../../components/ui/Skeleton";

const SCRIPT_TYPES = ["behavioral", "speech", "hybrid"] as const;
const TYPE_LABELS: Record<string, string> = {
  behavioral: "Behavioral",
  speech: "Speech",
  hybrid: "Hybrid",
};
const TYPE_ICONS: Record<string, typeof MapPin> = {
  behavioral: MapPin,
  speech: Mic,
  hybrid: Layers,
};

function getGroupForType(type: string): string {
  const t = type.toLowerCase();
  if (SCRIPT_TYPES.includes(t as (typeof SCRIPT_TYPES)[number])) return t;
  if (t === "mall-guide") return "behavioral";
  return "behavioral";
}

export function ScriptsScreen() {
  const location = useLocation();
  const preselectedRobot = (location.state as { selectedRobot?: string } | undefined)?.selectedRobot;

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch(() => setScenarios([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = SCRIPT_TYPES.reduce<Record<string, Scenario[]>>((acc, t) => {
    acc[t] = scenarios.filter((s) => getGroupForType(s.type) === t);
    return acc;
  }, {});

  const getScriptDetailPath = (id: string) => {
    if (id === "mall-guide") return "/scripts/mall-guide";
    return `/scripts/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-full pb-20">
        <div className="px-6 py-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="glass-card rounded-2xl p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Scripts</h1>
          <p className="text-[#a0a0a0] text-sm">
            Browse and run scripts on your robots. Behavioral, speech, and hybrid scenarios.
          </p>
        </div>

        <div className="space-y-8">
          {SCRIPT_TYPES.map((type) => {
            const items = grouped[type] ?? [];
            const label = TYPE_LABELS[type];

            return (
              <section key={type}>
                <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4"> {label}</h2>
                {items.length === 0 ? (
                  <div className="glass-card rounded-2xl p-6 text-center">
                    <p className="text-[#666] text-sm">No scripts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((script) => {
                      const IconComponent = TYPE_ICONS[getGroupForType(script.type)] ?? MapPin;
                      const hasDetailScreen = script.id === "mall-guide";

                      return (
                        <div
                          key={script.id}
                          className="glass-card rounded-2xl p-6 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.06)] transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="glass-icon-container p-3 rounded-xl shrink-0">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-[17px] mb-1">{script.name}</h3>
                              <p className="text-[#a0a0a0] text-sm leading-relaxed">{script.description}</p>
                              {hasDetailScreen ? (
                                <Link
                                  to={getScriptDetailPath(script.id)}
                                  state={preselectedRobot ? { selectedRobot: preselectedRobot } : undefined}
                                  className="mt-4 inline-block px-4 py-2.5 bg-primary text-black font-semibold text-sm rounded-xl hover:bg-[#33e8ff] transition-all"
                                >
                                  Open
                                </Link>
                              ) : (
                                <span className="mt-4 inline-block px-4 py-2.5 glass-button-secondary text-[#666] rounded-xl text-sm font-medium cursor-not-allowed">
                                  Coming soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          <section>
            <div
              className="glass-card rounded-2xl p-6 border-dashed opacity-60 cursor-not-allowed"
              title="В разработке"
            >
              <div className="flex items-center gap-4">
                <div className="glass-icon-container p-3 rounded-xl shrink-0">
                  <Plus className="w-6 h-6 text-[#666]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[17px] mb-1">Create Script</h3>
                  <p className="text-[#666] text-sm">В разработке</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
