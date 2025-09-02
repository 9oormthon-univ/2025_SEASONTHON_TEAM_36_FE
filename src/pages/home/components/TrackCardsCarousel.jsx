// src/components/TrackCardsCarousel.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SwipeCarousel from "../../../layout/SwipeCarousel";
import DotIndicator from "./DotIndicator";
import TaskCard from "./TaskCard";

/** tasks: [{ dday, title, progress }] */
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
            <TaskCard key={i} dday={t.dday} title={t.title} progress={t.progress} />
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
