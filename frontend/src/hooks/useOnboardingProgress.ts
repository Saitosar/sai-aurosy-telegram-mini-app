import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sai-aurosy-onboarding-robots";
const CUSTOM_EVENT = "sai-aurosy-onboarding-change";

export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingState {
  step: OnboardingStep;
  completedAt?: string;
}

function readState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { step: 1 };
    const parsed = JSON.parse(raw) as OnboardingState;
    return { step: parsed.step ?? 1, completedAt: parsed.completedAt };
  } catch {
    return { step: 1 };
  }
}

function notifyChange() {
  window.dispatchEvent(new CustomEvent(CUSTOM_EVENT));
}

export function useOnboardingProgress() {
  const [state, setState] = useState<OnboardingState>(readState);

  useEffect(() => {
    const handler = () => setState(readState());
    window.addEventListener(CUSTOM_EVENT, handler);
    return () => window.removeEventListener(CUSTOM_EVENT, handler);
  }, []);

  const setStep = useCallback((step: OnboardingStep) => {
    const next: OnboardingState = { ...readState(), step };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyChange();
  }, []);

  const markStep1Completed = useCallback(() => {
    const current = readState();
    if (current.step < 2) setStep(2);
  }, [setStep]);

  const markStep2Completed = useCallback(() => {
    const current = readState();
    if (current.step < 3) setStep(3);
  }, [setStep]);

  const markCompleted = useCallback(() => {
    const next: OnboardingState = { step: 3, completedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyChange();
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    notifyChange();
  }, []);

  const isCompleted = !!state.completedAt;

  return {
    step: state.step,
    isCompleted,
    setStep,
    markStep1Completed,
    markStep2Completed,
    markCompleted,
    reset,
  };
}
