// src/pages/home/index.tsx
import { useEffect, useMemo } from "react";
import styled from "styled-components";

import OnboardingScenes from "../onboarding/scenes";
import CardsCarousel from "./components/CardsCarousel";
import ChatbotBtn from "./components/ChatbotBtn";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import GoalCard from "./components/GoalCard";
import TodayStepsSheet from "./components/TodayStepsSheet/TodayStepsSheet";
import { useFetchSteps } from "./hooks/useFetchSteps";
import { useActiveGoalStore } from "./store/useActiveGoalStore";
import { useBottomSheetStore } from "./store/useBottomSheetStore";
import { useBindGoalsStore, useGoalsStore } from "./store/useGoalsStore";

// styled-components transient props
export interface BodyStyledProps {
  $sheetHeight: number; // px
  $shrink: number; // 0~1
}

export default function HomePage() {
  // 전역 상태
  const { goals, loading, error } = useGoalsStore();
  const { activeId, setActiveId } = useActiveGoalStore();

  // API ↔ Zustand 동기화 + 개발용 더미 fallback
  useBindGoalsStore();
  useFetchSteps(activeId);

  const sheetHeight = useBottomSheetStore(s => s.heightPx);
  const isSheetOpen = useBottomSheetStore(s => s.open);

  // 시트 열림 여부에 따른 카드 축소율
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;

  // Carousel에 넘길 ids (id 없으면 음수 센티널)
  const ids = useMemo<number[]>(
    () =>
      goals.map((g, i) => {
        const id = g?.id;
        return typeof id === "number" && Number.isFinite(id) ? id : -(i + 1);
      }),
    [goals],
  );

  // goals 변경 시 activeId 유효성 보장
  useEffect(() => {
    if (!goals.length) return;
    const currentId = useActiveGoalStore.getState().activeId; // Zustand 현재값
    if (currentId == null || !goals.some(t => t.id === currentId)) {
      setActiveId(goals[0].id);
    }
  }, [goals, setActiveId]);

  const hasGoals = goals.length > 0;

  if (loading) {
    return (
      <Page>
        <div style={{ padding: "2rem", textAlign: "center" }}>불러오는 중…</div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div style={{ padding: "2rem", textAlign: "center" }}>에러가 발생했어요 😢</div>
      </Page>
    );
  }
  return (
    <Page>
      <OnboardingScenes />
      <ChatbotBtn isSheetOpen={isSheetOpen} />
      {!isSheetOpen && <TopSpacing />}
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <DateView hideYear={isSheetOpen} />
        {hasGoals ? (
          <CardsCarousel ids={ids} maxDots={5}>
            {goals.map((g, i) => (
              <GoalCard key={ids[i]?.toString()} goal={g} shrink={shrink} />
            ))}
          </CardsCarousel>
        ) : (
          <EmptyState />
        )}
      </Body>
      <BottomSpacing />

      {hasGoals && <TodayStepsSheet />}
    </Page>
  );
}

const Page = styled.section`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh; /* iOS 주소창 변동 대응 */
  background: var(--bg-2);
  color: var(--text-1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; /* 바깥 스크롤 막기 */
  overscroll-behavior: none; /* iOS 일부 버전은 무시해도 무해 */
`;

const Body = styled.div<BodyStyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 스크롤 관성 */
`;

const TopSpacing = styled.div`
  height: calc(30px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(50px + env(safe-area-inset-top, 0px));
  }
  width: 100%;
`;

const BottomSpacing = styled.div`
  height: calc(54px + env(safe-area-inset-bottom, 0px));
  @media (min-height: 700px) {
    height: calc(90px + env(safe-area-inset-bottom, 0px));
  }
  width: 100%;
`;
