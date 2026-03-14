import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Square } from "lucide-react";
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
      <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        {/* Map: object-contain = full map visible + max size on any device */}
        <div className="relative inline-block max-w-full max-h-full">
          <img
            src="/city-mall-floorplan.png"
            alt="City Mall floor plan"
            className="block max-w-full max-h-full w-auto h-auto object-contain opacity-95"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
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
        </div>

        <motion.button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors flex items-center justify-center touch-target"
          whileTap={{ scale: 0.98 }}
          aria-label="Stop"
        >
          <Square className="w-5 h-5" />
        </motion.button>

        <div className="absolute top-16 left-4 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 z-10">
          <p className="text-white font-bold text-lg tracking-wide">City Mall</p>
          <p className="text-primary text-xs font-medium">Mall Guide</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-black/70 backdrop-blur-sm border-t border-white/10 pointer-events-auto">
          {phase === "asking" && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-medium text-xs sm:text-sm">
                  Which store are you looking for?
                </p>
                <motion.button
                  type="button"
                  onClick={() => setShowAllStores((s) => !s)}
                  className="text-xs text-primary/80 hover:text-primary font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  {showAllStores ? "Hide markers" : "Show all stores"}
                </motion.button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={storeInput}
                  onChange={(e) => setStoreInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmitStore();
                    }
                  }}
                  placeholder="For example: Zara, Mango..."
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-[16px] placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
                <motion.button
                  onClick={handleSubmitStore}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-primary text-black font-bold rounded-2xl hover:bg-[#33e8ff] transition-colors text-sm sm:text-base"
                  whileTap={{ scale: 0.98 }}
                >
                  Search
                </motion.button>
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
            <div className="space-y-2 sm:space-y-3">
              <p className="text-white font-medium text-center text-sm sm:text-base">
                You have arrived at {targetStore}
              </p>
              <motion.button
                onClick={submitThanks}
                className="w-full py-2 sm:py-3 bg-primary text-black font-bold rounded-2xl hover:bg-[#33e8ff] transition-colors text-sm sm:text-base"
                whileTap={{ scale: 0.98 }}
              >
                Thank you!
              </motion.button>
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
