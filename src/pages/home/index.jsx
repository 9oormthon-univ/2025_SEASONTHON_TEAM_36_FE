import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet";
import { useMemo, useState, useEffect } from "react";
import CardsCarousel from "./components/CardsCarousel";

import homeGoals from "./store/todos.mock.json";

export default function HomePage() {
  const tasks = useMemo(() => {
    const contents = homeGoals?.contents ?? [];
    return contents.map((g) => ({
      id: g.id,
      dday: g.dDay,
      title: g.title,
      warmMessage: g.warmMessage,
      progress: Number(g.progress ?? 0),
    }));
  }, []);

  const [activeId, setActiveId] = useState(null);

  // BottomSheet 높이(px)
  const [sheetHeight, setSheetHeight] = useState(0);
  useEffect(() => {
    console.log("✅ sheetHeight updated:", sheetHeight);
  }, [sheetHeight]);

  // 시트가 열렸다고 판단할 임계값(픽셀)
  const OPEN_THRESHOLD_PX = 100;
  // 열렸을 때 더 많이 줄이기 위한 계수 (0.68 = 32% 추가 축소)
  const SHRINK_OPEN = 0.68;
  const SHRINK_CLOSED = 1;
  const shrink = sheetHeight > OPEN_THRESHOLD_PX ? SHRINK_OPEN : SHRINK_CLOSED;

  useEffect(() => {
    if (!tasks.length) return;
    if (activeId == null || !tasks.some((t) => t.id === activeId)) {
      setActiveId(tasks[0].id);
    }
  }, [tasks, activeId]);

  const hasTasks = tasks.length > 0;

  return (
    <Page>
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <TopSpacing />
        <DateView />
        {hasTasks ? (
          <CardsCarousel
            tasks={tasks}
            activeId={activeId}
            onActiveIdChange={setActiveId}
          />
        ) : (
          <EmptyState />
        )}
        <BottomSpacing />
      </Body>

      {hasTasks ? (
        <TodayStepsSheet todoId={activeId} onHeightChange={setSheetHeight} />
      ) : null}
    </Page>
  );
}

/* ===== styled-components ===== */

const Page = styled.section`
  /* AppLayout/Main이 전체 높이를 관리, 100%로 두는 것이 안전 */
  min-height: 100%;
  background: var(--bg-1);
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
`;

/** 핵심: 상단(TopSpacing + DateView + Carousel)을 감싸는 컨테이너
 *  - 기본 남는 높이: (100dvh - sheetHeight - nav)
 *  - 여기에 shrink 계수를 곱해 '더 많이' 줄임
 *    → open 시 0.68배, 닫힘 시 1배
 */
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
