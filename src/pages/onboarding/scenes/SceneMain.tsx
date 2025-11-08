// ---
import { forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";
import { RespTodo } from "@/common/types/response/todo";
import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";

import OnbDateView from "../components/OnbDateView";
import OnbEmptyState from "../components/OnbEmptyState";
import OnbGoalCard from "../components/OnbGoalCard";
import OnbStepsSheet from "../components/OnbStepsSheet";
import { SceneProps } from "../layout/OnbLayout";
import { useOnbUiStore } from "../store/useOnbUiStore";

const goals: RespTodo[] = [
  // 마감일 11월 15일로 가정
  {
    id: 101,
    userId: 1,
    currentDate: "2025-11-08",
    dDay: "D-7",
    title: "자서전 작성하기",
    warmMessage: "매일의 발자국이 모여 큰 걸음이 될거야",
    progress: 45,
    isCompleted: false,
    todoType: "HOMEWORK",
  },
];

/** Goal 단위의 전체 Steps 뷰 모델 (toGoalStepsView 반환) */
/** ✅ StepListGroup 더미 데이터 (완성형) */

// styled-components transient props
export interface BodyStyledProps {
  $sheetHeight: number; // px
  $shrink: number; // 0~1
}

export default function SceneMain({ stage, setSpotRect }: SceneProps) {
  const refChatbot = useRef<HTMLButtonElement>(null);
  const refGoalCard = useRef<HTMLDivElement>(null);
  const refSheet = useRef<HTMLDivElement>(null);

  const openBottomSheet = useOnbUiStore(s => s.openBottomSheet);
  const closeBottomSheet = useOnbUiStore(s => s.closeBottomSheet);
  const setUrgent = useOnbUiStore(s => s.setUrgent);

  const openSheet = useBottomSheetStore(s => s.openSheet);
  const closeSheet = useBottomSheetStore(s => s.closeSheet);
  const expandSheet = useBottomSheetStore(s => s.expandSheet);
  const collapseSheet = useBottomSheetStore(s => s.collapseSheet);
  // stage.id 변화 시에만 초기화/분기 실행

  useEffect(() => {
    // 하이라이트 대상 보고
    if (stage.componenetKey === "chatbot" && refChatbot.current) {
      setSpotRect(refChatbot.current.getBoundingClientRect());
    } else if (stage.componenetKey === "goal-card" && refGoalCard.current) {
      setSpotRect(refGoalCard.current.getBoundingClientRect());
    } else if (stage.componenetKey === "bottom-sheet" && refSheet.current) {
      setSpotRect(refSheet.current.getBoundingClientRect());
    } else {
      setSpotRect(null);
    }

    // ✅ 바텀시트 열기/닫기/확장/축소를 SceneMain에서 통합 제어
    if (stage.id !== "sheet-content") {
      openSheet();
    } else if (stage.id === "sheet-content") {
      openSheet();
      expandSheet(); // 콘텐츠 보여줄 때는 확장
      // collapseSheet();
    } else {
      closeSheet(); // 그 외 단계는 닫기
    }

    // 기존 UI store 동기화 (필요 시 유지)
    if (stage.id === "sheet-scroll" || stage.id === "sheet-content") {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }

    // 시급함 뱃지
    setUrgent(stage.sceneKey === "main-w-urgent");

    const noGoals =
      stage.id === "start" || stage.id === "chatboticon" || stage.id === "chatbot-icon";
    setHasGoals(!noGoals);
  }, [stage.id, stage.sceneKey, stage.componenetKey]);

  const hasGoals = useOnbUiStore(s => s.hasGoals);
  const setHasGoals = useOnbUiStore(s => s.setHasGoals);
  const sheetHeight = useBottomSheetStore(s => s.heightPx);
  const isSheetOpen = useBottomSheetStore(s => s.open);
  // 시트 열림 여부에 따른 카드 축소율
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;
  return (
    <Page>
      <OnbChatbotBtn ref={refChatbot} onClick={() => {}} isSheetOpen={isSheetOpen} />
      {!isSheetOpen && <TopSpacing />}
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <OnbDateView />

        {hasGoals ? <OnbGoalCard goal={goals[0]} shrink={shrink} /> : <OnbEmptyState />}
      </Body>
      <BottomSpacing />

      {hasGoals && <OnbStepsSheet key={stage.id} />}
    </Page>
  );
}

const Page = styled.section`
  min-height: 100%;
  background: var(--bg-2);
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
  justify-content: flex-start;
  width: 100%;
  min-height: 0;
`;

const TopSpacing = styled.div`
  height: calc(14px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(24px + env(safe-area-inset-top, 0px));
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

const OnbChatbotBtn = forwardRef<HTMLButtonElement, { isSheetOpen: boolean; onClick: () => void }>(
  ({ isSheetOpen, onClick }, ref) => {
    return (
      <Button ref={ref} onClick={onClick} $isSheetOpen={isSheetOpen} aria-label="AI 개구리 Rana">
        <AIImg src={AI} alt="AI" />
      </Button>
    );
  },
);
OnbChatbotBtn.displayName = "OnbChatbotBtn";

const Button = styled.button<{ $isSheetOpen: boolean }>`
  position: fixed;
  top: 30px;
  right: 62px;
  z-index: 10;
  transition:
    top 0.3s ease,
    right 0.3s ease;
  @media (min-width: 414px) {
    right: 90px;
  }
  @media (min-height: 700px) {
    top: calc(${props => (props.$isSheetOpen ? 90 : 120)}px + env(safe-area-inset-bottom, 0px));
  }
`;

const AIImg = styled.img`
  width: 42px;
  height: 42px;
`;
