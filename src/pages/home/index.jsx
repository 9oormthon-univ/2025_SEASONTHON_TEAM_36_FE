import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TaskModal from "./components/TaskModal";
import { useMemo, useState, useEffect } from "react";
import TaskCardsCarousel from "./components/TaskCardsCarousel";

import homeGoals from "./store/todos.mock.json";

export default function HomePage() {
  const tasks = useMemo(() => {
    const contents = homeGoals?.contents ?? [];
    return contents.map((g) => ({
      id: g.id,                    // ✅ id 필수
      dday: g.dDay,
      title: g.title,
      warmMessage: g.warmMessage,
      progress: Number(g.progress ?? 0),
    }));
  }, []);

  // ✅ 현재 활성 카드의 id를 관리
  const [activeId, setActiveId] = useState(null);
  console.log(activeId);

  // 초기/데이터 변경 시 기본 id 설정
  useEffect(() => {
    if (!tasks.length) return;
    if (activeId == null || !tasks.some(t => t.id === activeId)) {
      setActiveId(tasks[0].id);
    }
  }, [tasks, activeId]);

  const current = tasks.find(t => t.id === activeId) ?? null;

  return (
    <Page>
      <TopSpacing />
      <DateView />

      {tasks.length ? (
        <TaskCardsCarousel
          tasks={tasks}
          activeId={activeId}              // ✅ id로 제어
          onActiveIdChange={setActiveId}   // ✅ 스와이프 시 id 받아옴
        />
      ) : (
        <EmptyState />
      )}

      {/* ✅ 현재 선택된 카드 id로 API 호출 */}
      <TaskModal todoId={activeId} />
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
