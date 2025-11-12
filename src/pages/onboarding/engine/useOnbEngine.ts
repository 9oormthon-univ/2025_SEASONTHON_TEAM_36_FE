// src/pages/home/onboarding/engine/useOnbEngine.ts
import { useCallback, useMemo, useRef, useState } from "react";

import type { OnbStage } from "./stages";

type OnbEngineOptions = {
  onComplete?: () => void;
};

export function useOnbEngine(
  initialStages: OnbStage[],
  initialId?: string,
  options?: OnbEngineOptions,
) {
  const { onComplete } = options ?? {};

  const [stages, setStages] = useState<OnbStage[]>(initialStages);
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!initialId) return 0;
    const idx = initialStages.findIndex(s => s.id === initialId);
    return idx >= 0 ? idx : 0;
  });

  const idIndex = useRef<Map<string, number>>(new Map(initialStages.map((s, i) => [s.id, i])));

  const complete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const next = useCallback(() => {
    setActiveIndex(i => {
      const last = stages.length - 1;
      if (i >= last) {
        // 이미 마지막이면 완료 처리
        complete();
        return i;
      }
      const n = i + 1;
      if (n === last + 1) complete();
      return Math.min(n, last);
    });
  }, [stages.length, complete]);

  const prev = useCallback(() => setActiveIndex(i => Math.max(i - 1, 0)), []);

  const goTo = useCallback(
    (idOrIndex: string | number) => {
      if (typeof idOrIndex === "number") {
        setActiveIndex(Math.max(0, Math.min(idOrIndex, stages.length - 1)));
        return;
      }
      const idx = idIndex.current.get(idOrIndex);
      if (idx != null) setActiveIndex(idx);
    },
    [stages.length],
  );

  const api = useMemo(
    () => ({ stages, activeIndex, setStages, next, prev, goTo, complete }),
    [stages, activeIndex, next, prev, goTo, complete],
  );

  return api;
}
