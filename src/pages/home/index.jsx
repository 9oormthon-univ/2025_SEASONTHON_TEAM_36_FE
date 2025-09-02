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
import TaskCardsCarousel from "./components/TrackCardsCarousel";

/**
 * 홈/페이지: 카드 스와이프 + 인디케이터 연동
 * - 좌우 스와이프로 index 변경 → DotIndicator에 반영
 * - DotIndicator는 고정값(5칸)
 */
export default function HomePage() {
  // DotIndicator가 5칸 고정이라 카드도 5장만 사용
  const tasks = useMemo(() => tasksData.slice(0, 5), []);

  const hasTasks = tasks.length > 0;

  return (
    <Page>
      <TopSpacing />
      <DateView />

      {hasTasks ? <TaskCardsCarousel tasks={tasks} /> : <EmptyState />}

      <TaskModal />
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