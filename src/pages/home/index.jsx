import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TaskModal from "./components/TaskModal";

// 새 JSON 데이터 사용 
import homeGoals from "./store/todos.mock.json";
import { useMemo } from "react";
import TaskCardsCarousel from "./components/TaskCardsCarousel";

/**
 * 홈/페이지: 카드 스와이프 + 인디케이터 연동
 * - 카드 수(N)만큼 스와이프 가능
 * - DotIndicator는 최대 5칸 '창'이 좌우로 슬라이드하며 현재 위치 표시
 */
export default function HomePage() {
  // JSON -> 카드용 데이터로 매핑
  const tasks = useMemo(() => {
    const contents = homeGoals?.contents ?? [];
    return contents.map((g) => ({
      id: g.id,
      dday: g.dDay,
      title: g.title,
      warmMessage: g.warmMessage,
      progress: Number(g.progress ?? 0),
      steps: g.stepResponses ?? [],
      // 필요시 추가 필드: currentDate: g.currentDate, userId: g.userId
    }));
  }, []);
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
