// ---
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";
import { RespTodo } from "@/common/types/response/todo";

import OnbDateView from "../components/OnbDateView";
import OnbEmptyState from "../components/OnbEmptyState";
import OnbGoalCard from "../components/OnbGoalCard";
import OnbStepsSheet from "../components/OnbStepsSheet";
import { SceneProps } from "../layout/OnbLayout";
import { useOnbSheetStore } from "../store/useOnbSheetStore";
import { useOnbUiStore } from "../store/useOnbUiStore";

const goals: RespTodo[] = [
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

/** SpotRect를 지속 보고하는 훅 */
function useSpotReporter(
  targetRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  setSpotRect: (r: DOMRect | null) => void,
) {
  useLayoutEffect(() => {
    if (!active) {
      setSpotRect(null);
      return;
    }
    let raf = 0;

    const tick = () => {
      const el = targetRef.current;
      setSpotRect(el ? el.getBoundingClientRect() : null);
      raf = requestAnimationFrame(tick);
    };

    const onScrollOrResize = () => {
      const el = targetRef.current;
      setSpotRect(el ? el.getBoundingClientRect() : null);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [active, targetRef, setSpotRect]);
}

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

  const openSheet = useOnbSheetStore(s => s.openSheet);
  // const closeSheet = useOnbSheetStore(s => s.closeSheet);
  const expandSheet = useOnbSheetStore(s => s.expandSheet);

  // 어떤 타깃을 하이라이트할지
  const highlightChatbot = stage.componentKey === "chatbot";
  const highlightGoalCard = stage.componentKey === "goal-card";
  const highlightBottomSheet = stage.componentKey === "bottom-sheet";

  // 각 타깃에 대해 spotRect 지속 보고
  useSpotReporter(refChatbot, highlightChatbot, setSpotRect);
  useSpotReporter(refGoalCard, highlightGoalCard, setSpotRect);
  useSpotReporter(refSheet, highlightBottomSheet, setSpotRect);

  const hasGoals = useOnbUiStore(s => s.hasGoals);
  const setHasGoals = useOnbUiStore(s => s.setHasGoals);
  const sheetHeight = useOnbSheetStore(s => s.heightPx);
  const isSheetOpen = useOnbSheetStore(s => s.open);

  // ==== 파생 플래그를 effect 밖에서 계산 ====
  const shouldExpand = stage.id === "sheet-content";
  const shouldOpenBottom = stage.id === "sheet-scroll" || stage.id === "sheet-content";
  const isUrgent = stage.id === "siren" || stage.id === "adjust" || stage.id === "adjust-icon";
  const noGoals = stage.id === "start" || stage.id === "chatboticon" || stage.id === "chatbot-icon";
  const goalsFlag = !noGoals;

  useEffect(() => {
    // ✅ 바텀시트 열기/확장
    openSheet();
    if (shouldExpand) expandSheet();

    // ✅ 기존 UI store 동기화
    if (shouldOpenBottom) openBottomSheet();
    else closeBottomSheet();

    // ✅ 시급함 뱃지 & 카드 유무
    setUrgent(isUrgent);
    setHasGoals(goalsFlag);
  }, [
    // 액션들: zustand에서는 보통 stable ref -> 의존성에 넣어도 안전
    openSheet,
    expandSheet,
    openBottomSheet,
    closeBottomSheet,
    setUrgent,
    setHasGoals,
    // 파생 플래그들
    shouldExpand,
    shouldOpenBottom,
    isUrgent,
    goalsFlag,
  ]);
  // 시트 열림 여부에 따른 카드 축소율
  const SHRINK_OPEN = 0.89 as const;
  const SHRINK_CLOSED = 1 as const;
  const shrink: number = isSheetOpen ? SHRINK_OPEN : SHRINK_CLOSED;

  return (
    <Page>
      <OnbChatbotBtn
        ref={refChatbot}
        onClick={() => {}}
        isSheetOpen={isSheetOpen}
        className="onb-chatbot-spot"
      />
      {!isSheetOpen && <TopSpacing />}

      <Body $sheetHeight={sheetHeight} $shrink={shrink}>
        <OnbDateView />

        {hasGoals ? (
          <OnbGoalCard
            ref={refGoalCard}
            goal={goals[0]}
            shrink={shrink}
            className="onb-goalcard-spot"
            isUrgent={isUrgent}
          />
        ) : (
          <OnbEmptyState />
        )}
      </Body>

      <BottomSpacing />

      {/* 바텀시트는 외곽 래퍼로 ref 연결 (포털 사용 시 위치 추적 안정화) */}
      {hasGoals && (
        <div ref={refSheet} className="onb-bsheet-spot" data-onb-target="bottom-sheet">
          <OnbStepsSheet key={stage.id} stageId={stage.id} />
        </div>
      )}
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

type OnbChatbotBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSheetOpen: boolean;
};

const OnbChatbotBtn = forwardRef<HTMLButtonElement, OnbChatbotBtnProps>(
  ({ isSheetOpen, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        $isSheetOpen={isSheetOpen}
        {...rest} // className, onClick, aria-* 등 모두 전달
      >
        <AIImg src={AI} alt="AI" />
      </Button>
    );
  },
);
OnbChatbotBtn.displayName = "OnbChatbotBtn";

const Button = styled.button<{ $isSheetOpen: boolean }>`
  position: fixed;
  top: 10vh;
  right: 15vw;
  z-index: 5;
  transition:
    top 0.3s ease,
    right 0.3s ease;
  @media (min-width: 414px) {
    right: 16vw;
  }
  @media (min-height: 700px) {
    top: calc(${props => (props.$isSheetOpen ? 13 : 14)}vh + env(safe-area-inset-bottom, 0px));
  }
`;

const AIImg = styled.img`
  width: 44px;
  height: 42px;
`;
