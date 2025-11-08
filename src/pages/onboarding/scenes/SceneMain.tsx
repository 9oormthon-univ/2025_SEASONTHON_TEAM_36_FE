// ---
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";
import { RespTodo } from "@/common/types/response/todo";
import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";

import OnbDateView from "../components/OnbDateView";
import OnbEmptyState from "../components/OnbEmptyState";
import OnbGoalCard from "../components/OnbGoalCard";
import OnbStepsSheet from "../components/OnbStepsSheet";

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
const todaySteps = [
  {
    key: "today",
    title: "오늘의 한 걸음",
    items: [
      {
        stepId: 6,
        stepOrder: 6,
        stepDate: "2025-11-08",
        description: "글 퇴고와 맞춤법 검사하기",
        isCompleted: false,
        state: "pause",
        id: 6,
      },
      {
        stepId: 5,
        stepOrder: 5,
        stepDate: "2025-11-08",
        description: "결론 작성하기",
        isCompleted: false,
        state: "pause",
        id: 5,
      },
      {
        stepId: 4,
        stepOrder: 4,
        stepDate: "2025-11-08",
        description: "본문 작성하기",
        isCompleted: false,
        state: "pause",
        id: 4,
      },
    ],
  },
  {
    key: "past",
    title: "놓친 한 걸음",
    items: [
      {
        stepId: 3,
        stepOrder: 3,
        stepDate: "2025-11-08",
        description: "서론+어린시절 작성하기",
        isCompleted: false,
        state: "pause",
        id: 3,
      },
      {
        stepId: 2,
        stepOrder: 2,
        stepDate: "2025-11-08",
        description: "자서전의 전체 흐름과 목차 결정하기",
        isCompleted: false,
        state: "pause",
        id: 2,
      },
      {
        stepId: 1,
        stepOrder: 1,
        stepDate: "2025-11-08",
        description: "자서전 경험 후보 정리하기",
        isCompleted: false,
        state: "pause",
        id: 1,
      },
    ],
  },
];

// styled-components transient props
export interface BodyStyledProps {
  $sheetHeight: number; // px
  $shrink: number; // 0~1
}

export default function SceneMain() {
  const hasGoals = true;
  const sheetHeight = useBottomSheetStore(s => s.heightPx);
  const isSheetOpen = useBottomSheetStore(s => s.open);
  // 시트 열림 여부에 따른 카드 축소율
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;
  return (
    <Page>
      <OnbChatbotBtn onClick={() => {}} isSheetOpen={isSheetOpen} />
      {!isSheetOpen && <TopSpacing />}
      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <OnbDateView />

        {hasGoals ? <OnbGoalCard goal={goals[0]} shrink={shrink} /> : <OnbEmptyState />}
      </Body>
      <BottomSpacing />

      {hasGoals && <OnbStepsSheet groups={todaySteps} />}
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

const OnbChatbotBtn = ({ isSheetOpen, onClick }: { isSheetOpen: boolean; onClick: () => void }) => {
  return (
    <Button onClick={onClick} $isSheetOpen={isSheetOpen}>
      <AIImg src={AI} alt="AI" />
    </Button>
  );
};

const Button = styled.button<{ $isSheetOpen: boolean }>`
  position: fixed;
  top: 30px;
  right: 62px;
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
