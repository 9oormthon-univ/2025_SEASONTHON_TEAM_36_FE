import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet";
import { useMemo, useState, useEffect } from "react";
import CardsCarousel from "./components/CardsCarousel";
import { fetchTodos } from "@/apis/todo"; // API 사용 !!!
import TestTodoButtons from "../../apis/TestTodoButtons";
import TestStepButtons from "../../apis/TestStepButtons";

export default function HomePage() {
  const [goals, setGoals] = useState([]); // 서버 데이터 !!!
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeId, setActiveId] = useState(null); // 현재 화면에 표시되는 goal id
  const [sheetHeight, setSheetHeight] = useState(0);

  // 시트가 열렸다고 판단할 임계값(픽셀)
  const OPEN_THRESHOLD_PX = 100;
  const SHRINK_OPEN = 0.89;
  const SHRINK_CLOSED = 1;
  const shrink = sheetHeight > OPEN_THRESHOLD_PX ? SHRINK_OPEN : SHRINK_CLOSED;

  // 최초 로딩 - 실제 API 호출 !
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchTodos()
      .then((res) => {
        if (!alive) return;
        const contents = Array.isArray(res?.contents) ? res.contents : [];
        setGoals(contents);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  // 화면에 표시되는 card의 id -> activeId 기본값 세팅 
  useEffect(() => {
    if (!goals.length) return;
    if (activeId == null || !goals.some((t) => t.id === activeId)) {
      setActiveId(goals[0].id);
    }
  }, [goals, activeId]);

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
      <TestTodoButtons />
      <TestStepButtons />
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <TopSpacing />
        <DateView />
        {hasGoals ? (
          <CardsCarousel
            goals={goals}
            activeId={activeId}
            onActiveIdChange={setActiveId}
            shrink={shrink}
          />
        ) : (
          <EmptyState />
        )}
        <BottomSpacing />
      </Body>

      {hasGoals ? (
        <TodayStepsSheet goalId={activeId} onHeightChange={setSheetHeight} />
      ) : null}
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 0;
  height: calc(
    (100dvh - ${(p) => p.$sheetHeight}px - var(--navbar-height, 0px))
    * ${(p) => p.$shrink}
  );
`;

const TopSpacing = styled.div`
  height: calc(45px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(75px + env(safe-area-inset-top, 0px));
  }
`;

const BottomSpacing = styled.div`
  height: calc(54px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(90px + env(safe-area-inset-top, 0px));
  }
`;
