import { useCallback, useState } from "react";
import { useStorePositions } from "./useStorePositions";

export type MallGuidePhase =
  | "idle"
  | "asking"
  | "guiding"
  | "arrived"
  | "returning";

const GUIDING_DURATION_MS = 4000;
const ARRIVED_DURATION_MS = 2000;
const RETURNING_DURATION_MS = 4000;

export function useMallGuideSimulation() {
  const { findStore } = useStorePositions();
  const [phase, setPhase] = useState<MallGuidePhase>("asking");
  const [targetStore, setTargetStore] = useState<string | null>(null);
  const [storeNotFound, setStoreNotFound] = useState(false);

  const submitStoreQuery = useCallback((query: string) => {
    setStoreNotFound(false);
    const found = findStore(query);
    if (found) {
      setTargetStore(found);
      setPhase("guiding");
    } else {
      setStoreNotFound(true);
    }
  }, [findStore]);

  const submitThanks = useCallback(() => {
    setPhase("returning");
  }, []);

  const onGuidingComplete = useCallback(() => {
    setPhase("arrived");
  }, []);

  const onReturningComplete = useCallback(() => {
    setTargetStore(null);
    setPhase("asking");
  }, []);

  const stop = useCallback(() => {
    setPhase("asking");
    setTargetStore(null);
    setStoreNotFound(false);
  }, []);

  return {
    phase,
    targetStore,
    storeNotFound,
    submitStoreQuery,
    submitThanks,
    onGuidingComplete,
    onReturningComplete,
    stop,
    guidingDurationMs: GUIDING_DURATION_MS,
    arrivedDurationMs: ARRIVED_DURATION_MS,
    returningDurationMs: RETURNING_DURATION_MS,
  };
}
