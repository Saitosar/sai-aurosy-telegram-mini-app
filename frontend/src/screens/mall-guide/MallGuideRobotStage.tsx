import { Bot } from "lucide-react";
import { useMallGuidePath } from "./useMallGuidePath";
import type { MallGuidePhase } from "./useMallGuideSimulation";

function getStepLabel(phase: MallGuidePhase, targetStore: string | null): string {
  switch (phase) {
    case "guiding":
      return targetStore ? `I'm guiding you — ${targetStore}` : "I'm guiding you";
    case "arrived":
      return "You have arrived";
    case "returning":
      return "Returning to reception";
    default:
      return "";
  }
}

interface MallGuideRobotStageProps {
  phase: MallGuidePhase;
  targetStore: string | null;
  guidingDurationMs: number;
  returningDurationMs: number;
  onGuidingComplete: () => void;
  onReturningComplete: () => void;
}

export function MallGuideRobotStage({
  phase,
  targetStore,
  guidingDurationMs,
  returningDurationMs,
  onGuidingComplete,
  onReturningComplete,
}: MallGuideRobotStageProps) {
  const pathPosition = useMallGuidePath({
    phase,
    targetStore,
    guidingDurationMs,
    returningDurationMs,
    onGuidingComplete,
    onReturningComplete,
  });
  const stepLabel = getStepLabel(phase, targetStore);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-2 border-white shadow-[0_0_12px_rgba(0,229,255,0.9)] flex items-center justify-center"
        style={{ left: `${pathPosition.left}%`, top: `${pathPosition.top}%` }}
      >
        <Bot className="w-5 h-5 text-black" strokeWidth={2.5} />
      </div>

      {stepLabel && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full mb-1"
          style={{ left: `${pathPosition.left}%`, top: `${pathPosition.top}%` }}
        >
          <div className="px-4 py-2 rounded-xl bg-black/80 border border-primary/30 text-white text-sm font-medium text-center shadow-[0_0_12px_rgba(0,229,255,0.2)] whitespace-nowrap max-w-[200px] truncate">
            {stepLabel}
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black/80"
            style={{ marginTop: "-1px" }}
          />
        </div>
      )}
    </div>
  );
}
