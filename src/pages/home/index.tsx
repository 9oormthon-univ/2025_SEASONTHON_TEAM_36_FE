// src/pages/home/index.tsx
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { fetchTodos } from "@/apis/todo";

import CardsCarousel from "./components/CardsCarousel";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet/TodayStepsSheet";
import type { ApiTodosResponse, BodyStyledProps, GoalId, HomeGoal } from "./types/home";

export default function HomePage() {
  const [goals, setGoals] = useState<HomeGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const [activeId, setActiveId] = useState<GoalId | null>(null);
  const [sheetHeight, setSheetHeight] = useState<number>(0);

  const OPEN_THRESHOLD_PX = 100;
  const isSheetOpen = sheetHeight > OPEN_THRESHOLD_PX;
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;

  // 공용 재조회 함수: Promise 처리/에러 처리 모두 포함
  const reloadTodos = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = (await fetchTodos()) as ApiTodosResponse | null;
      const contents = Array.isArray(res?.contents) ? res.contents : [];
      setGoals(contents);
      setError(null);
    } catch (e) {
      console.error("할 일 목록 재로드 실패:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 최초 로딩도 공용 함수 재사용
  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        setLoading(true);
        const res = (await fetchTodos()) as ApiTodosResponse | null;
        if (!alive) return;
        const list = Array.isArray(res?.contents) ? res.contents : [];
        setGoals(list);
      } catch (e) {
        if (!alive) return;
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // goals 변경 시 activeId 유효성 보장 (goals만 의존)
  useEffect(() => {
    if (!goals.length) return;
    // 현재 activeId가 비어 있거나, 새 goals에 존재하지 않으면 첫 번째로 교체
    setActiveId(prev => (prev == null || !goals.some(t => t.id === prev) ? goals[0].id : prev));
  }, [goals]);

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
            activeId={activeId}
            onActiveIdChange={setActiveId}
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
          goalId={activeId}
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
