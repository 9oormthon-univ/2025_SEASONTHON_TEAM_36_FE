// src/components/TrackCardsCarousel.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SwipeCarousel from "../../../layout/SwipeCarousel";
import DotIndicator from "./DotIndicator";
import TaskCard from "./TaskCard";

/** tasks: [{ id?, dday|dDay, title, progress, warmMessage }] */
export default function TaskCardsCarousel({ tasks = [] }) {
  const [index, setIndex] = useState(0);

  // tasks 길이가 줄어들었을 때 index 안전 범위로 보정
  useEffect(() => {
    if (index > tasks.length - 1) {
      setIndex(Math.max(0, tasks.length - 1));
    }
  }, [tasks.length, index]);

  return (
    <Wrap>
      <CarouselWrap>
        <SwipeCarousel index={index} onIndexChange={setIndex}>
          {tasks.map((t, i) => (
            <TaskCard
              key={t.id ?? `${t.title ?? "task"}-${i}`}
              dday={t.dday ?? "D-0"}
              title={t.title ?? ""}
              progress={Number.isFinite(+t.progress) ? +t.progress : 0}
              warmMessage={t.warmMessage ?? ""}
            />
          ))}
        </SwipeCarousel>
      </CarouselWrap>

      <IndicatorRow>
        {/* 전체 개수에 맞춰 동적으로 5칸 창이 슬라이드 */}
        <DotIndicator index={index} total={tasks.length} maxDots={5} />
      </IndicatorRow>
    </Wrap>
  );
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
