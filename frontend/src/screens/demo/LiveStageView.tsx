import { RobotStage } from "./RobotStage";
import { CrowdLayer } from "./CrowdLayer";
import type { DemoMetrics } from "./useDemo";

const STEPS = [
  "Robot greets visitors",
  "Robot invites kids",
  "Robot performs dance",
  "Robot plays music",
  "Robot takes photos",
  "Robot thanks audience",
] as const;

const TOTAL_STEPS = 6;

interface LiveStageViewProps {
  currentStep: number;
  stepProgress: number;
  isRunning: boolean;
  isComplete: boolean;
  visitorCount: number;
  metrics: DemoMetrics;
}

export function LiveStageView({
  currentStep,
  stepProgress,
  isRunning,
  isComplete,
  visitorCount,
  metrics,
}: LiveStageViewProps) {
  const progressFill = currentStep + stepProgress;
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <div className="relative flex-1 min-h-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/magic-city-map.png)",
            opacity: 0.95,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[35%] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0,122,255,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="absolute top-16 left-4 px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
          <p className="text-foreground font-semibold text-lg tracking-wide">Magic City</p>
          <p className="text-primary text-xs font-medium">Event zone: Fountain</p>
        </div>

        <CrowdLayer
          crowdCount={visitorCount}
          isRunning={isRunning}
          isComplete={isComplete}
        />

        <RobotStage
          currentStep={currentStep}
          currentStepLabel={STEPS[currentStep]}
          isRunning={isRunning}
          isComplete={isComplete}
        />

        <div className="absolute top-16 right-4 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-primary/20">
          <p className="text-foreground text-sm font-medium">
            <span className="text-primary font-bold">{metrics.visitorsAttracted}</span> visitors
            {" · "}
            <span className="text-primary font-bold">{metrics.childrenInteractions}</span> kids
            {" · "}
            <span className="text-primary font-bold">{metrics.eventDurationMinutes}</span> min
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-lg bg-black/60 backdrop-blur-sm border border-primary/20">
          <div className="flex items-center justify-between gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className="flex items-center flex-1 min-w-0 last:flex-none">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < currentStep
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                        ? "border-2 border-primary text-primary bg-primary/20"
                        : "bg-white/10 text-white/60 border border-white/20"
                  }`}
                >
                  {i + 1}
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div className="flex-1 min-w-[8px] h-0.5 mx-0.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-200"
                      style={{
                        width:
                          progressFill <= i
                            ? "0%"
                            : progressFill >= i + 1
                              ? "100%"
                              : `${(progressFill - i) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
