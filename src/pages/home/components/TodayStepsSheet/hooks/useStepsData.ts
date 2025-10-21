// src/pages/home/components/TodayStepsSheet/hooks/useStepsData.ts
import { useEffect, useMemo, useState } from "react";

import { StepListGroup, TodayPastLists } from "@/pages/home/types/steps";
import { getTodayAndPastLists } from "@/pages/home/utils/stepsView";

import { toPaused } from "../utils/stepMappers";

export function useStepsData(goalId?: number | null) {
  const [loading, setLoading] = useState(false);
  const [parted, setParted] = useState<TodayPastLists>({
    meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
    today: [],
    past: [],
  });

  useEffect(() => {
    let alive = true;
    if (goalId == null) {
      setParted({
        meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
        today: [],
        past: [],
      });
      return;
    }
    void (async () => {
      try {
        setLoading(true);
        const res = await getTodayAndPastLists(goalId);
        if (alive) {
          setParted(
            res ?? {
              meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
              today: [],
              past: [],
            },
          );
        }
      } catch (e: unknown) {
        console.error("[useStepsData] getTodayAndPastLists error:", e);
        if (alive) {
          setParted({
            meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
            today: [],
            past: [],
          });
          const msg = e instanceof Error ? e.message : String(e);
          alert(msg || "할 일(step) 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [goalId]);

  const todayItems = useMemo(() => parted.today.map(toPaused("today")), [parted.today]);
  const pastItems = useMemo(() => parted.past.map(toPaused("past")), [parted.past]);

  // 공용 타입에 맞춘 그룹 (key 필수)
  const baseGroups: StepListGroup[] = useMemo(
    () => [
      { key: "today", title: "오늘의 한 걸음", items: todayItems },
      { key: "past", title: "놓친 한 걸음", items: pastItems },
    ],
    [todayItems, pastItems],
  );

  return { loading, parted, baseGroups };
}
