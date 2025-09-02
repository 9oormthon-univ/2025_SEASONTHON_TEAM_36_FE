// src/components/TrackCardsCarousel.jsx
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import SwipeCarousel from "../../../layout/SwipeCarousel";
import DotIndicator from "./DotIndicator";
import TaskCard from "./TaskCard";

/** tasks: [{ id, dday|dDay, title, progress, warmMessage }] */
export default function TaskCardsCarousel({
  tasks = [],
  activeId,                 // ✅ 현재 활성 카드 id (optional: controlled)
  onActiveIdChange,         // ✅ 활성 카드 id 변경 콜백
}) {
  // 내부 인덱스 (uncontrolled 모드에서 사용)
  const [innerIndex, setInnerIndex] = useState(0);

  // id 목록
  const ids = useMemo(
    () => tasks.map((t, i) => t?.id ?? `${t?.title ?? "task"}-${i}`),
    [tasks]
  );

  // activeId가 주어지면 id → index로 역매핑해서 controlled로 동작
  const controlledIndex = useMemo(() => {
    if (activeId == null) return null;
    const idx = ids.indexOf(activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId, ids]);

  const index = Number.isInteger(controlledIndex)
    ? controlledIndex
    : clamp(innerIndex, 0, Math.max(0, tasks.length - 1));

  const setIndexBoth = (next) => {
    const nextVal = clamp(
      typeof next === "function" ? next(index) : next,
      0,
      Math.max(0, tasks.length - 1)
    );

    // 내부 인덱스 갱신 (uncontrolled일 때만)
    if (controlledIndex == null) setInnerIndex(nextVal);

    // ✅ id 콜백 올려주기
    const nextId = ids[nextVal];
    if (nextId != null) onActiveIdChange?.(nextId);
  };

  // tasks 길이가 변할 때 현재 index/id 보정
  useEffect(() => {
    if (tasks.length === 0) return;
    // 현재 index를 한 번 보정 → 부모에도 id 알려줌
    setIndexBoth(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);

  return (
    <Wrap>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndexBoth}>
          {tasks.map((t, i) => (
            <TaskCard
              key={ids[i]}
              dday={t.dday ?? "D-0"}
              title={t.title ?? ""}
              progress={Number.isFinite(+t.progress) ? +t.progress : 0}
              warmMessage={t.warmMessage ?? ""}
            />
          ))}
        </SwipeCarousel>
      </CarouselWrap>

      <IndicatorRow>
        <DotIndicator index={index} total={tasks.length} maxDots={5} />
      </IndicatorRow>
    </Wrap>
  );
}

function clamp(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

const Wrap = styled.div` width: 100%; `;
const CarouselWrap = styled.section`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;
const IndicatorRow = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
`;
