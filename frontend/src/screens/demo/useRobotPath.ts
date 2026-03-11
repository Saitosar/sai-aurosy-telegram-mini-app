import { useEffect, useState } from "react";

const PATH_POINTS = [
  { left: 50, top: 35 }, // start
  { left: 50, top: 22 }, // forward
  { left: 65, top: 22 }, // right
  { left: 35, top: 22 }, // left
  { left: 50, top: 35 }, // back to start
] as const;

const SEGMENT_DURATION_MS = 2500;
const CYCLE_DURATION_MS = (PATH_POINTS.length - 1) * SEGMENT_DURATION_MS;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function useRobotPath(isActive: boolean) {
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: PATH_POINTS[0].left,
    top: PATH_POINTS[0].top,
  });

  useEffect(() => {
    if (!isActive) return;

    let rafId: number;
    const startTime = Date.now();

    const update = () => {
      const elapsed = (Date.now() - startTime) % CYCLE_DURATION_MS;
      const segmentIndex = Math.min(
        Math.floor(elapsed / SEGMENT_DURATION_MS),
        PATH_POINTS.length - 2
      );
      const segmentProgress = (elapsed % SEGMENT_DURATION_MS) / SEGMENT_DURATION_MS;
      const t = easeInOut(segmentProgress);

      const from = PATH_POINTS[segmentIndex];
      const to = PATH_POINTS[segmentIndex + 1];

      setPosition({
        left: lerp(from.left, to.left, t),
        top: lerp(from.top, to.top, t),
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  return position;
}
