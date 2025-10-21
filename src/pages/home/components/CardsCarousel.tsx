import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import SwipeCarousel from "../../../layout/SwipeCarousel";
import { useActiveGoalStore } from "../store/useActiveGoalStore";
import { useGoalsStore } from "../store/useGoalsStore";
import DotIndicator from "./DotIndicator";
import GoalCard from "./GoalCard";

export interface CardsCarouselProps {
  shrink?: number;
}

export default function CardsCarousel({ shrink = 1 }: CardsCarouselProps) {
  const [innerIndex, setInnerIndex] = useState<number>(0);

  // 전역 Zustand store 활용
  const goals = useGoalsStore(s => s.goals);
  const { activeId, setActiveId } = useActiveGoalStore();

  // ids를 항상 number로 보장 (id 없으면 음수 센티널 사용)
  const ids = useMemo<number[]>(
    () =>
      goals.map((g, i) => {
        const id = g?.id;
        return typeof id === "number" && Number.isFinite(id) ? id : -(i + 1);
      }),
    [goals],
  );

  const controlledIndex = useMemo<number | null>(() => {
    if (activeId == null) return null;
    const idx = ids.indexOf(activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId, ids]);

  const index = Number.isInteger(controlledIndex as number)
    ? (controlledIndex as number)
    : clamp(innerIndex, 0, Math.max(0, goals.length - 1));

  const setIndexBoth = (next: number | ((prev: number) => number)) => {
    const computed = typeof next === "function" ? (next as (p: number) => number)(index) : next;
    const nextVal = clamp(computed, 0, Math.max(0, goals.length - 1));

    if (controlledIndex == null) setInnerIndex(nextVal);

    const nextId = ids[nextVal];
    if (typeof nextId === "number") setActiveId(nextId);
  };

  // goals 변화 시 전역 activeId 유효성 보장
  useEffect(() => {
    if (goals.length === 0) return;

    if (activeId == null || !ids.includes(activeId)) {
      const first = ids[0];
      if (typeof first === "number") setActiveId(first);
      setInnerIndex(0);
      return;
    }

    const idx = ids.indexOf(activeId);
    if (idx !== index) setInnerIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length, ids.join(","), activeId]);

  return (
    <>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndexBoth}>
          {goals.map((g, i) => (
            <GoalCard key={ids[i]?.toString()} goal={g} shrink={shrink} />
          ))}
        </SwipeCarousel>
      </CarouselWrap>
      <IndicatorRow>
        <DotIndicator index={index} total={goals.length} maxDots={5} />
      </IndicatorRow>
    </>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

const CarouselWrap = styled.section`
  width: 100%;
  max-width: 560px;
  margin: 3vh auto 0;
`;

const IndicatorRow = styled.div`
  display: flex;
  justify-content: center;
`;
