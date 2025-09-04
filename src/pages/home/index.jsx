import styled from "styled-components";
import DateView from "./components/DateView";
import EmptyState from "./components/EmptyState";
import TodayStepsSheet from "./components/TodayStepsSheet";
import { useMemo, useState, useEffect } from "react";
import CardsCarousel from "./components/CardsCarousel";

/** ✅ 하드코딩된 데이터 (총 6개) !!! API !!! */
const homeGoals = {
  pages: 0,
  total: 0,
  contents: [
    {
      currentDate: "2025-09-03",
      id: 1,
      userId: 1,
      dDay: "D-3",
      title: "우물밖개구리 프로젝트",
      warmMessage: "개구리가 햇빛을 보기 시작했어요!",
      progress: 0,
      isCompleted: false,
      stepResponses: [
        { stepDate: "2025-09-02", stepOrder: 1, description: "API 설계 문서 작성", isCompleted: false },
        { stepDate: "2025-09-03", stepOrder: 2, description: "회원 API 구현", isCompleted: false },
      ],
    },
    {
      currentDate: "2025-09-04",
      id: 2,
      userId: 1,
      dDay: "D-5",
      title: "BottomSheet 드래그 업",
      warmMessage: "조금만 더 위로 끌어올려봐요!",
      progress: 20,
      isCompleted: false,
      stepResponses: [
        { stepDate: "2025-09-03", stepOrder: 1, description: "컴포넌트 구조 리팩토링", isCompleted: false },
        { stepDate: "2025-09-04", stepOrder: 2, description: "드래그 이벤트 핸들러 구현", isCompleted: false },
      ],
    },
    {
      currentDate: "2025-09-05",
      id: 3,
      userId: 1,
      dDay: "D-7",
      title: "DotIndicator 동적 스케일",
      warmMessage: "점도 크기가 달라질 거예요!",
      progress: 40,
      isCompleted: false,
      stepResponses: [
        { stepDate: "2025-09-05", stepOrder: 1, description: "인디케이터 로직 작성", isCompleted: false },
        { stepDate: "2025-09-06", stepOrder: 2, description: "스타일 튜닝", isCompleted: false },
      ],
    },
    {
      currentDate: "2025-09-06",
      id: 4,
      userId: 1,
      dDay: "D-10",
      title: "TaskCard 헤더 정렬",
      warmMessage: "헤더가 딱 맞게 정렬되었어요!",
      progress: 60,
      isCompleted: false,
      stepResponses: [
        { stepDate: "2025-09-06", stepOrder: 1, description: "Flexbox 정렬 테스트", isCompleted: false },
        { stepDate: "2025-09-07", stepOrder: 2, description: "아이콘 마진 조정", isCompleted: false },
      ],
    },
    {
      currentDate: "2025-09-07",
      id: 5,
      userId: 1,
      dDay: "D-12",
      title: "IMC 기획서 1차",
      warmMessage: "첫 번째 초안이 완성되어 가네요!",
      progress: 80,
      isCompleted: false,
      stepResponses: [
        { stepDate: "2025-09-07", stepOrder: 1, description: "기획서 목차 작성", isCompleted: true },
        { stepDate: "2025-09-08", stepOrder: 2, description: "시장조사 정리", isCompleted: false },
      ],
    },
    {
      currentDate: "2025-09-08",
      id: 6,
      userId: 1,
      dDay: "D-15",
      title: "FrogBar 0% 오프셋 보정",
      warmMessage: "개구리도 처음부터 힘을 내야죠!",
      progress: 100,
      isCompleted: true,
      stepResponses: [
        { stepDate: "2025-09-08", stepOrder: 1, description: "진행바 초기 위치 보정", isCompleted: true },
        { stepDate: "2025-09-09", stepOrder: 2, description: "테스트 케이스 검증", isCompleted: true },
      ],
    },
  ],
};

export default function HomePage() {
  const goals = homeGoals?.contents ?? [];

  const [activeId, setActiveId] = useState(null); // 현재 화면에 표시되는 goal id
  // BottomSheet 높이(px)
  const [sheetHeight, setSheetHeight] = useState(0);

  // 시트가 열렸다고 판단할 임계값(픽셀)
  const OPEN_THRESHOLD_PX = 100;
  const SHRINK_OPEN = 0.89;
  const SHRINK_CLOSED = 1;
  const shrink = sheetHeight > OPEN_THRESHOLD_PX ? SHRINK_OPEN : SHRINK_CLOSED;

  useEffect(() => {
    if (!goals.length) return;
    if (activeId == null || !goals.some((t) => t.id === activeId)) {
      setActiveId(goals[0].id);
    }
  }, [goals, activeId]);

  const hasGoals = goals.length > 0;

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
            shrink={shrink}   // ✅ shrink 내려줌
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
