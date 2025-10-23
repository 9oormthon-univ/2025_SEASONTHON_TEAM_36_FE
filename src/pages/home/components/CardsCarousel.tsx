import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import SwipeCarousel from "../../../layout/SwipeCarousel";
import { useActiveGoalStore } from "../store/useActiveGoalStore";
import DotIndicator from "./DotIndicator";

export interface CardsCarouselProps {
  /** Carousel에 표시되는 아이템의 식별자들 (스와이프/activeId 동기화 기준) */
  ids: number[];
  /** 렌더링할 카드들 (ids.length와 동일한 개수여야 안전) */
  children: React.ReactNode;
  /** Dot 최대 표시 개수 (기본 5) */
  maxDots?: number;
}

export default function CardsCarousel({ ids, children, maxDots = 5 }: CardsCarouselProps) {
  const [innerIndex, setInnerIndex] = useState<number>(0);

  // 전역 activeId만 관리
  const { activeId, setActiveId } = useActiveGoalStore();

  // children을 배열로 정규화
  const items = useMemo(() => React.Children.toArray(children), [children]);
  const total = ids.length;

  // controlled index 계산
  const controlledIndex = useMemo<number | null>(() => {
    if (activeId == null) return null;
    const idx = ids.indexOf(activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId, ids]);

  const index = Number.isInteger(controlledIndex as number)
    ? (controlledIndex as number)
    : clamp(innerIndex, 0, Math.max(0, total - 1));

  const setIndexBoth = (next: number | ((prev: number) => number)) => {
    const computed = typeof next === "function" ? (next as (p: number) => number)(index) : next;
    const nextVal = clamp(computed, 0, Math.max(0, total - 1));

    // 언컨트롤 상황 대비 내부 인덱스 유지
    if (controlledIndex == null) setInnerIndex(nextVal);

    // 전역 activeId 동기화
    const nextId = ids[nextVal];
    if (typeof nextId === "number") setActiveId(nextId);
  };

  // ids/activeId 변화 시 인덱스 정합성 보장
  useEffect(() => {
    if (total === 0) return;

    // activeId가 없거나 리스트에 없으면 첫 아이템으로 맞춤
    if (activeId == null || !ids.includes(activeId)) {
      const first = ids[0];
      if (typeof first === "number") setActiveId(first);
      setInnerIndex(0);
      return;
    }

    // activeId는 유효하나 내부 인덱스 어긋난 경우 보정
    const idx = ids.indexOf(activeId);
    if (idx !== index) setInnerIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, ids.join(","), activeId]);

  return (
    <>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndexBoth}>
          {items.map((node, i) => (
            <div key={ids[i]?.toString()}>{node}</div>
          ))}
        </SwipeCarousel>
      </CarouselWrap>
      <IndicatorRow>
        <DotIndicator index={index} total={total} maxDots={maxDots} />
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
