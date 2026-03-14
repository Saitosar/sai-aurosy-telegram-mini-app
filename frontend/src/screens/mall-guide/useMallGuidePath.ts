import { useEffect, useRef, useState } from "react";
import type { StorePosition } from "./cityMallStores";
import { useStorePositions } from "./useStorePositions";
import type { MallGuidePhase } from "./useMallGuideSimulation";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPos(a: StorePosition, b: StorePosition, t: number): StorePosition {
  return {
    left: lerp(a.left, b.left, t),
    top: lerp(a.top, b.top, t),
  };
}

function positionAlongPath(path: StorePosition[], t: number): StorePosition {
  if (path.length <= 1 || t <= 0) return path[0];
  if (t >= 1) return path[path.length - 1];
  const segCount = path.length - 1;
  const segIndex = Math.min(Math.floor(t * segCount), segCount - 1);
  const localT = t * segCount - segIndex;
  return lerpPos(path[segIndex], path[segIndex + 1], localT);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

interface UseMallGuidePathParams {
  phase: MallGuidePhase;
  targetStore: string | null;
  guidingDurationMs: number;
  returningDurationMs: number;
  onGuidingComplete: () => void;
  onReturningComplete: () => void;
}

export function useMallGuidePath({
  phase,
  targetStore,
  guidingDurationMs,
  returningDurationMs,
  onGuidingComplete,
  onReturningComplete,
}: UseMallGuidePathParams) {
  const { reception, getStorePosition, getPath } = useStorePositions();
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: reception.left,
    top: reception.top,
  });
  const guidingCompleteRef = useRef(false);
  const returningCompleteRef = useRef(false);

  useEffect(() => {
    if (phase === "asking" || phase === "idle") {
      setPosition({ left: reception.left, top: reception.top });
      guidingCompleteRef.current = false;
      returningCompleteRef.current = false;
      return;
    }

    if (phase === "arrived" && targetStore) {
      const storePos = getStorePosition(targetStore);
      if (storePos) {
        setPosition({ left: storePos.left, top: storePos.top });
      }
      return;
    }

    if (phase === "guiding" && targetStore) {
      const storePos = getStorePosition(targetStore);
      if (!storePos) return;

      const path = getPath(reception, storePos, targetStore);
      const points = path && path.length > 1 ? path : [reception, storePos];

      let rafId: number;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(1, elapsed / guidingDurationMs);
        const eased = easeInOut(t);

        setPosition(positionAlongPath(points, eased));

        if (t >= 1 && !guidingCompleteRef.current) {
          guidingCompleteRef.current = true;
          onGuidingComplete();
        }

        if (t < 1) {
          rafId = requestAnimationFrame(update);
        }
      };

      rafId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(rafId);
    }

    if (phase === "returning" && targetStore) {
      const storePos = getStorePosition(targetStore);
      if (!storePos) return;

      const path = getPath(reception, storePos, targetStore);
      const points =
        path && path.length > 1 ? [...path].reverse() : [storePos, reception];

      let rafId: number;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(1, elapsed / returningDurationMs);
        const eased = easeInOut(t);

        setPosition(positionAlongPath(points, eased));

        if (t >= 1 && !returningCompleteRef.current) {
          returningCompleteRef.current = true;
          onReturningComplete();
        }

        if (t < 1) {
          rafId = requestAnimationFrame(update);
        }
      };

      rafId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(rafId);
    }
  }, [
    phase,
    targetStore,
    reception,
    getStorePosition,
    getPath,
    guidingDurationMs,
    returningDurationMs,
    onGuidingComplete,
    onReturningComplete,
  ]);

  return position;
}
