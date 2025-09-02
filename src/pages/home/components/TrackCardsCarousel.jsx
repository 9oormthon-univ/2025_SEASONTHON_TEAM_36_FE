import React, { useState } from "react";
import styled from "styled-components";
// import SwipeCarousel from "./SwipeCarousel";
import DotIndicator from "./DotIndicator";
import TaskCard from "./TaskCard";
import SwipeCarousel from "../../../layout/SwipeCarousel";

/** 
 * TaskCardsCarousel
 * - tasks: [{ dday, title, progress }]
 * - 내부에서 index 상태를 관리하며 SwipeCarousel ↔ DotIndicator 연동
 */
export default function TaskCardsCarousel({ tasks = [] }) {
  const [index, setIndex] = useState(0);

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
        <DotIndicator index={index} />
      </IndicatorRow>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
`;

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
