// src/pages/home/HomePage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";

import { fetchTodos } from "@/apis/todo"; // 서버 API 호출

import CardsCarousel from "./components/CardsCarousel";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet";

export default function HomePage() {
  const [goals, setGoals] = useState([]);        // 서버에서 불러온 ToDo 목록
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);      // 에러 상태

  const [activeId, setActiveId] = useState(null); // 현재 화면에 표시되는 goal id
  const [sheetHeight, setSheetHeight] = useState(0);

  // 시트가 열렸다고 판단할 임계값(픽셀)
  const OPEN_THRESHOLD_PX = 100;
  const SHRINK_OPEN = 0.89;
  const SHRINK_CLOSED = 1;
  const shrink = sheetHeight > OPEN_THRESHOLD_PX ? SHRINK_OPEN : SHRINK_CLOSED;

  // 최초 로딩 - 실제 API 호출
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
    return () => {
      alive = false;
    };
  }, []);
  // goalcard에서 todo 삭제 후 재조회
  const reloadTodos = async () => {
    try {
      const res = await fetchTodos();
      const contents = Array.isArray(res?.contents) ? res.contents : [];
      setGoals(contents);
    } catch (e) {
      console.error("재로드 실패:", e);
    }
  };

  // goals가 갱신될 때 activeId가 없으면 첫 goal을 기본 선택
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
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <TopSpacing />
        <DateView />
        {hasGoals ? (
          <CardsCarousel
            goals={goals}
            activeId={activeId}
            onActiveIdChange={setActiveId}
            shrink={shrink}
            onGoalDeleted={reloadTodos}
          />
        ) : (
          <EmptyState />
        )}
        <BottomSpacing />
      </Body>

      {hasGoals && (
        <TodayStepsSheet goalId={activeId} onHeightChange={setSheetHeight} />
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
  height: calc(54px + env(safe-area-inset-bottom, 0px));
  @media (min-height: 700px) {
    height: calc(90px + env(safe-area-inset-bottom, 0px));
  }
`;
