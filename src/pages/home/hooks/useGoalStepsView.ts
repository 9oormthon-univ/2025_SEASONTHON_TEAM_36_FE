// src/pages/home/utils/useGoalStepsView.ts
import { useCallback, useEffect, useState } from "react";

import { getGoalStepsView } from "../utils/stepsView";

export interface GoalStepsVM {
  dDay: string;
  title: string;
  endDate: string;
  progressText: string;
  progress: number;
  steps: Array<{
    stepId: number | null;
    stepDate: string;
    description: string;
  }>;
}

const EMPTY_VM: GoalStepsVM = {
  dDay: "D-0",
  title: "",
  endDate: "-",
  progressText: "",
  progress: 0,
  steps: [],
};

export function useGoalStepsView(open: boolean, goalId: number | string | null) {
  const [view, setView] = useState<GoalStepsVM | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!open || goalId == null) return;
    let alive = true;
    setLoading(true);
    setError(null);
    try {
      const vm = await getGoalStepsView(goalId as number);
      if (!alive) return;
      setView(vm);
    } catch (e) {
      if (!alive) return;
      setError(e);
    } finally {
      if (alive) setLoading(false);
    }
    return () => {
      alive = false;
    };
  }, [open, goalId]);

  useEffect(() => {
    if (!open || goalId == null) return;
    let canceled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const vm = await getGoalStepsView(goalId as number);
        if (!canceled) setView(vm);
      } catch (e) {
        if (!canceled) setError(e);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [open, goalId]);

  const vm = view ?? EMPTY_VM;
  return { vm, view, loading, error, reload: load };
}
