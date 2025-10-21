// src/pages/home/components/CardsCarousel.tsx
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { RespTodo } from "@/common/types/response/todo";

import SwipeCarousel from "../../../layout/SwipeCarousel";
import { useActiveGoalStore } from "../store/useActiveGoalStore";
import DotIndicator from "./DotIndicator";
import GoalCard from "./GoalCard";

export interface CardsCarouselProps {
  goals?: RespTodo[];
  shrink?: number;
  onGoalDeleted?: () => void;
  onGoalAdjusted?: () => void | Promise<void>;
}

export default function CardsCarousel({
  goals = [],
  shrink = 1,
  onGoalDeleted,
  onGoalAdjusted,
}: CardsCarouselProps) {
  const [innerIndex, setInnerIndex] = useState<number>(0);

  // 전역 activeId 사용
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

    // 내부 인덱스 업데이트 (언컨트롤 상황 대비)
    if (controlledIndex == null) setInnerIndex(nextVal);

    // 전역 activeId 갱신
    const nextId = ids[nextVal];
    if (typeof nextId === "number") setActiveId(nextId);
  };

  // goals 변화 시 전역 activeId 유효성 보장
  useEffect(() => {
    if (goals.length === 0) return;

    // 현재 activeId가 없거나, 목록에 없으면 첫 카드로 맞춤
    if (activeId == null || !ids.includes(activeId)) {
      const first = ids[0];
      if (typeof first === "number") setActiveId(first);
      setInnerIndex(0);
      return;
    }

    // activeId는 유효하나, 내부 인덱스가 어긋난 경우 동기화
    const idx = ids.indexOf(activeId);
    if (idx !== index) setInnerIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length, ids.join(","), activeId]);

  return (
    <>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndexBoth}>
          {goals.map((g, i) => (
            <GoalCard
              key={ids[i]?.toString()}
              goal={g}
              shrink={shrink}
              onDeleted={onGoalDeleted}
              onGoalAdjusted={onGoalAdjusted}
            />
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
