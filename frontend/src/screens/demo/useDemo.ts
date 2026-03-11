import { useCallback, useEffect, useRef, useState } from "react";

const STEP_DURATION_MS = 3500;
const TOTAL_STEPS = 6;

export interface DemoMetrics {
  visitorsAttracted: number;
  childrenInteractions: number;
  eventDurationMinutes: number;
  engagementTimeSeconds: number;
  promotionImpressions: number;
}

const INITIAL_METRICS: DemoMetrics = {
  visitorsAttracted: 0,
  childrenInteractions: 0,
  eventDurationMinutes: 0,
  engagementTimeSeconds: 0,
  promotionImpressions: 0,
};

const TARGET_METRICS: DemoMetrics = {
  visitorsAttracted: 120,
  childrenInteractions: 75,
  eventDurationMinutes: 15,
  engagementTimeSeconds: 48,
  promotionImpressions: 340,
};

export function useDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState<DemoMetrics>(INITIAL_METRICS);
  const [visitorCount, setVisitorCount] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStep(0);
    setMetrics(INITIAL_METRICS);
    setVisitorCount(0);
    startTimeRef.current = Date.now();
    setStepProgress(0);
  }, []);

  const stop = useCallback(() => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);

  useEffect(() => {
    if (!isRunning || startTimeRef.current === null) return;

    stepIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= TOTAL_STEPS - 1) {
          if (stepIntervalRef.current) {
            clearInterval(stepIntervalRef.current);
            stepIntervalRef.current = null;
          }
          if (metricsIntervalRef.current) {
            clearInterval(metricsIntervalRef.current);
            metricsIntervalRef.current = null;
          }
          setIsComplete(true);
          setIsRunning(false);
          setMetrics(TARGET_METRICS);
          setVisitorCount(40);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION_MS);

    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || startTimeRef.current === null) return;

    metricsIntervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - (startTimeRef.current ?? 0);
      const elapsed = elapsedMs / 1000;
      const totalDuration = (TOTAL_STEPS * STEP_DURATION_MS) / 1000;
      const progress = Math.min(1, elapsed / totalDuration);
      const stepElapsed = elapsedMs % STEP_DURATION_MS;
      setStepProgress(stepElapsed / STEP_DURATION_MS);

      setMetrics({
        visitorsAttracted: Math.floor(TARGET_METRICS.visitorsAttracted * progress),
        childrenInteractions: Math.floor(TARGET_METRICS.childrenInteractions * progress),
        eventDurationMinutes: Math.floor(TARGET_METRICS.eventDurationMinutes * progress),
        engagementTimeSeconds: Math.min(
          TARGET_METRICS.engagementTimeSeconds,
          Math.floor(elapsed * 3)
        ),
        promotionImpressions: Math.floor(TARGET_METRICS.promotionImpressions * progress),
      });
      setVisitorCount(Math.min(40, Math.floor(progress * 40)));
    }, 200);

    return () => {
      if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
    };
  }, [isRunning]);

  return {
    isRunning,
    isComplete,
    currentStep,
    stepProgress: isComplete ? 1 : stepProgress,
    metrics: isComplete ? TARGET_METRICS : metrics,
    visitorCount: isComplete ? 40 : visitorCount,
    start,
    stop,
    restart,
  };
}
