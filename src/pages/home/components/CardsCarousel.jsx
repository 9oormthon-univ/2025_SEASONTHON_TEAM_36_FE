import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import SwipeCarousel from "../../../layout/SwipeCarousel";
import DotIndicator from "./DotIndicator";
import GoalCard from "./GoalCard";

/** goals: [{ id, dDay, title, progress, warmMessage, ... }] */
export default function CardsCarousel({
  goals = [],
  activeId,
  onActiveIdChange,
  shrink = 1,
  onGoalDeleted,
}) {
  const [innerIndex, setInnerIndex] = useState(0);

  const ids = useMemo(
    () => goals.map((g, i) => g?.id ?? `${g?.title ?? "goal"}-${i}`),
    [goals]
  );

  const controlledIndex = useMemo(() => {
    if (activeId == null) return null;
    const idx = ids.indexOf(activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId, ids]);

  const index = Number.isInteger(controlledIndex)
    ? controlledIndex
    : clamp(innerIndex, 0, Math.max(0, goals.length - 1));

  const setIndexBoth = (next) => {
    const nextVal = clamp(
      typeof next === "function" ? next(index) : next,
      0,
      Math.max(0, goals.length - 1)
    );
    if (controlledIndex == null) setInnerIndex(nextVal);
    const nextId = ids[nextVal];
    if (nextId != null) onActiveIdChange?.(nextId);
  };

  useEffect(() => {
    if (goals.length === 0) return;
    setIndexBoth(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length]);

  return (
    <>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndexBoth}>
          {goals.map((g, i) => (
            <GoalCard
              key={ids[i]}
              goal={g}        // 각각의 goal 객체 자체 전달
              shrink={shrink}
              onDeleted={onGoalDeleted}
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

function clamp(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

const CarouselWrap = styled.section`
  width: 100%;
  max-width: 560px;
  margin: 1.2% auto;
`;

const IndicatorRow = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
`;
