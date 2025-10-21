// src/pages/home/index.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";

import CardsCarousel from "./components/CardsCarousel";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet/TodayStepsSheet";
import { useFetchTodos } from "./hooks/useFetchTodos";
import { useActiveGoalStore } from "./store/useActiveGoalStore";

// styled-components transient props
export interface BodyStyledProps {
  $sheetHeight: number; // px
  $shrink: number; // 0~1
}

export default function HomePage() {
  const { goals, loading, error, reloadTodos } = useFetchTodos();
  const { activeId: _activeId, setActiveId } = useActiveGoalStore();

  const [sheetHeight, setSheetHeight] = useState<number>(0);

  const OPEN_THRESHOLD_PX = 100;
  const isSheetOpen = sheetHeight > OPEN_THRESHOLD_PX;
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;

  // goals 변경 시 activeId 유효성 보장
  useEffect(() => {
    if (!goals.length) return;
    const currentId = useActiveGoalStore.getState().activeId; // Zustand에서 현재 값 가져오기
    if (currentId == null || !goals.some(t => t.id === currentId)) {
      setActiveId(goals[0].id);
    }
  }, [goals, setActiveId]);

  const hasGoals = goals.length > 0;

  if (loading) {
    return (
      <Page>
        <div style={{ padding: "2rem" }}>불러오는 중…</div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div style={{ padding: "2rem" }}>에러가 발생했어요 😢</div>
      </Page>
    );
  }

  return (
    <Page>
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <TopSpacing />
        <DateView hideYear={isSheetOpen} />
        {hasGoals ? (
          <CardsCarousel
            goals={goals}
            shrink={shrink}
            onGoalDeleted={() => {
              void reloadTodos();
            }}
            onGoalAdjusted={() => {
              void reloadTodos();
            }}
          />
        ) : (
          <EmptyState />
        )}
        <BottomSpacing />
      </Body>

      {hasGoals && (
        <TodayStepsSheet
          onHeightChange={setSheetHeight}
          onStepCompl={() => {
            void reloadTodos();
          }}
        />
      )}
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
  box-sizing: border-box;
  width: 100%;
`;

const Body = styled.div<BodyStyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 0;
  height: calc((100dvh - ${p => p.$sheetHeight}px - var(--navbar-height, 0px)) * ${p => p.$shrink});
`;

const TopSpacing = styled.div`
  height: calc(30px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(75px + env(safe-area-inset-top, 0px));
  }
`;

const BottomSpacing = styled.div`
  height: calc(54px + env(safe-area-inset-bottom, 0px));
  @media (min-height: 700px) {
    height: calc(90px + env(safe-area-inset-bottom, 0px));
  }
`;
