// src/pages/home/onboarding/engine/useOnbEngine.ts
// 온보딩 flow 이동 담당
import { useCallback, useMemo, useRef, useState } from "react";

import type { OnbStage } from "./stages";

export function useOnbEngine(initialStages: OnbStage[], initialId?: string) {
  const [stages, setStages] = useState<OnbStage[]>(initialStages);
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!initialId) return 0;
    const idx = initialStages.findIndex(s => s.id === initialId);
    return idx >= 0 ? idx : 0;
  });

  const idIndex = useRef<Map<string, number>>(new Map(initialStages.map((s, i) => [s.id, i])));

  const next = useCallback(
    () => setActiveIndex(i => Math.min(i + 1, stages.length - 1)),
    [stages.length],
  );
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
    () => ({ stages, activeIndex, setStages, next, prev, goTo }),
    [stages, activeIndex, next, prev, goTo],
  );

  return api;
}
