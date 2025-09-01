import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TaskCard from "./components/TaskCard";
import DotIndicator from "./components/DotIndicator";
import TaskModal from "./components/TaskModal";

// 더미데이터 
import tasksData from "./store/tasks.mock";
import { useMemo, useState } from "react";
import SwipeCarousel from "./components/SwipeCarousel";

// progress 퍼센트는 여기서 넘겨줌!!
/**
 * 홈/페이지: 카드 스와이프 + 인디케이터 연동
 * - 좌우 스와이프로 index 변경 → DotIndicator에 반영
 * - DotIndicator는 고정값(5칸)
 */
export default function HomePage() {
  // DotIndicator가 5칸 고정이라 카드도 5장만 사용 (필요시 pad 로직 추가)
  const tasks = useMemo(() => tasksData.slice(0, 5), []);
  const [index, setIndex] = useState(0);

  const hasTasks = tasks.length > 0;

  return (
    <Page>
      <TopSpacing />
      <DateView />
      {/* <EmptyState /> */}
      {/* <TaskCard progress={85} /> */}
      {/* <DotIndicator index={0}/> */}
       {hasTasks ? (
        <>
          <CarouselWrap>
            <SwipeCarousel index={index} onIndexChange={setIndex}>
              {tasks.map((t, i) => (
                <TaskCard
                  key={i}
                  dday={t.dday}
                  title={t.title}
                  cheer={t.cheer}
                  progress={t.progress} // ✅ progress 퍼센트 여기서 넘김
                />
              ))}
            </SwipeCarousel>
          </CarouselWrap>

          <IndicatorRow>
            <DotIndicator index={index} />
          </IndicatorRow>
        </>
      ) : (
        <EmptyState />
      )}

      <TaskModal/>
    </Page>
  );
}

const Page = styled.section`
  min-height: 100%;
  background: var(--bg-1);
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
`;

const TopSpacing = styled.div`
  height: calc(45px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(75px + env(safe-area-inset-top, 0px));
  }
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