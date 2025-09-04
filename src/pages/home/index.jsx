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

  // 시트가 열렸다고 판단할 임계값(픽셀)
  const OPEN_THRESHOLD_PX = 100;
  const SHRINK_OPEN = 0.89;
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
            shrink={shrink}   // ✅ shrink 내려줌
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
