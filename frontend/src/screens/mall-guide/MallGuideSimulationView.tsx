import { useMemo, useState } from "react";
import { useMallGuideSimulation } from "./useMallGuideSimulation";
import { MallGuideRobotStage } from "./MallGuideRobotStage";
import { PathOverlay } from "./PathOverlay";
import { StoreMarkers } from "./StoreMarkers";
import { useStorePositions } from "./useStorePositions";

interface MallGuideSimulationViewProps {
  onBack: () => void;
}

export function MallGuideSimulationView({ onBack }: MallGuideSimulationViewProps) {
  const {
    phase,
    targetStore,
    storeNotFound,
    submitStoreQuery,
    submitThanks,
    onGuidingComplete,
    onReturningComplete,
    stop,
    guidingDurationMs,
    returningDurationMs,
  } = useMallGuideSimulation();

  const [storeInput, setStoreInput] = useState("");
  const [showAllStores, setShowAllStores] = useState(false);
  const { reception, getStorePosition, getPath } = useStorePositions();

  const pathOverlay = useMemo(() => {
    if (
      (phase !== "guiding" && phase !== "returning") ||
      !targetStore
    )
      return null;
    const storePos = getStorePosition(targetStore);
    if (!storePos) return null;
    const path = getPath(reception, storePos, targetStore);
    if (!path || path.length < 2) return null;
    return phase === "returning" ? [...path].reverse() : path;
  }, [phase, targetStore, reception, getStorePosition, getPath]);

  const handleSubmitStore = () => {
    submitStoreQuery(storeInput);
  };

  const handleBack = () => {
    stop();
    onBack();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <div className="relative flex-1 min-h-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/city-mall-floorplan.png)",
            opacity: 0.95,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_0%,rgba(0,0,0,0.25)_100%)]" />

        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white font-medium text-sm hover:bg-black/80 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>Stop</span>
        </button>

        <div className="absolute top-16 left-4 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 z-10">
          <p className="text-white font-bold text-lg tracking-wide">City Mall</p>
          <p className="text-primary text-xs font-medium">Mall Guide</p>
        </div>

        <StoreMarkers targetStore={targetStore} showAllStores={showAllStores} />
        {pathOverlay && (
          <PathOverlay path={pathOverlay} className="opacity-60" />
        )}
        <MallGuideRobotStage
          phase={phase}
          targetStore={targetStore}
          guidingDurationMs={guidingDurationMs}
          returningDurationMs={returningDurationMs}
          onGuidingComplete={onGuidingComplete}
          onReturningComplete={onReturningComplete}
        />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-black/70 backdrop-blur-sm border-t border-white/10 pointer-events-auto">
          {phase === "asking" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-medium text-sm">
                  Which store are you looking for?
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllStores((s) => !s)}
                  className="text-xs text-primary/80 hover:text-primary font-medium"
                >
                  {showAllStores ? "Hide markers" : "Show all stores"}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={storeInput}
                  onChange={(e) => setStoreInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitStore()}
                  placeholder="For example: Zara, Mango..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSubmitStore}
                  className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-[#33e8ff] transition-colors"
                >
                  Search
                </button>
              </div>
              {storeNotFound && (
                <p className="text-red-400 text-sm">Store not found</p>
              )}
            </div>
          )}

          {phase === "guiding" && (
            <p className="text-white font-medium text-center">
              I'm guiding you — {targetStore ?? ""}
            </p>
          )}

          {phase === "arrived" && (
            <div className="space-y-3">
              <p className="text-white font-medium text-center">
                You have arrived at {targetStore}
              </p>
              <button
                onClick={submitThanks}
                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-[#33e8ff] transition-colors"
              >
                Thank you!
              </button>
            </div>
          )}

          {phase === "returning" && (
            <p className="text-white font-medium text-center">
              Returning to reception
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
