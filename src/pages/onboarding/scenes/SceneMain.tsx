import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import OnbChatbotBtn from "../components/OnbChatBotBtn";
import OnbDateView from "../components/OnbDateView";
import OnbEmptyState from "../components/OnbEmptyState";
import OnbGoalCard from "../components/OnbGoalCard";
import OnbStepsSheet from "../components/OnbStepsSheet";
import { SceneProps } from "../layout/OnbLayout";
import { useOnbSheetStore } from "../store/useOnbSheetStore";
import { useOnbUiStore } from "../store/useOnbUiStore";

/** SpotRect를 지속 보고하는 훅 */
function useSpotReporter(
  targetRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  setRect: (r: DOMRect | null) => void,
) {
  useLayoutEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }

    let raf = 0;
    const tick = () => {
      const el = targetRef.current;
      setRect(el ? el.getBoundingClientRect() : null);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const el = targetRef.current;
      setRect(el ? el.getBoundingClientRect() : null);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [active, targetRef, setRect]);
}

export default function SceneMain({ stage, setSpotRect }: SceneProps) {
  const refChatbot = useRef<HTMLButtonElement>(null);
  const refGoalCard = useRef<HTMLDivElement>(null);
  const refSheet = useRef<HTMLDivElement>(null);
  const refGoalHeaderSiren = useRef<HTMLButtonElement>(null);
  const refPlayBtn = useRef<HTMLButtonElement>(null);

  // siren 버튼의 rect 별도 보관 (화면에 오버레이 표시용)
  const [sirenRect, setSirenRect] = useState<DOMRect | null>(null);
  const [playRect, setPlayRect] = useState<DOMRect | null>(null);

  // ---- stage 판단 ----
  const highlightGoalHeaderSiren = stage.id === "adjust-icon";
  const highlightPlayBtn = stage.id === "play-btn";

  useSpotReporter(refGoalHeaderSiren, highlightGoalHeaderSiren, setSirenRect);
  useSpotReporter(refPlayBtn, highlightPlayBtn, setPlayRect);
  // 나머지 하이라이트 유지
  useSpotReporter(refChatbot, stage.componentKey === "chatbot", setSpotRect);
  useSpotReporter(refGoalCard, stage.componentKey === "goal-card", setSpotRect);
  useSpotReporter(refSheet, stage.componentKey === "bottom-sheet", setSpotRect);

  // ---- 기존 store / 상태 로직 생략 ----
  const openBottomSheet = useOnbUiStore(s => s.openBottomSheet);
  const closeBottomSheet = useOnbUiStore(s => s.closeBottomSheet);
  const setUrgent = useOnbUiStore(s => s.setUrgent);
  const openSheet = useOnbSheetStore(s => s.openSheet);
  const expandSheet = useOnbSheetStore(s => s.expandSheet);
  const sheetHeight = useOnbSheetStore(s => s.heightPx);
  const isSheetOpen = useOnbSheetStore(s => s.open);
  const hasGoals = useOnbUiStore(s => s.hasGoals);
  const setHasGoals = useOnbUiStore(s => s.setHasGoals);

  useEffect(() => {
    openSheet();
    if (stage.id === "sheet-content") expandSheet();
    if (stage.id === "sheet-scroll" || stage.id === "sheet-content") openBottomSheet();
    else closeBottomSheet();

    setUrgent(highlightGoalHeaderSiren);
    setHasGoals(stage.id !== "start");
  }, [
    openSheet,
    expandSheet,
    openBottomSheet,
    closeBottomSheet,
    setUrgent,
    setHasGoals,
    stage.id,
    highlightGoalHeaderSiren,
  ]);

  const shrink = isSheetOpen ? 0.89 : 1;

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
            goal={{
              id: 1,
              userId: 1,
              currentDate: "2025-11-08",
              dDay: "D-7",
              title: "자서전 작성하기",
              warmMessage: "매일의 발자국이 모여 큰 걸음이 될거야",
              progress: 45,
              isCompleted: false,
              todoType: "HOMEWORK",
            }}
            shrink={shrink}
            isUrgent={highlightGoalHeaderSiren || stage.id === "adjust" || stage.id === "siren"}
            sirenRef={refGoalHeaderSiren}
          />
        ) : (
          <OnbEmptyState />
        )}
      </Body>
      <BottomSpacing />

      {/* === 바텀시트 === */}
      {hasGoals && (
        <div ref={refSheet}>
          <OnbStepsSheet key={stage.id} stageId={stage.id} playBtnRef={refPlayBtn} />
        </div>
      )}

      {highlightGoalHeaderSiren && sirenRect && (
        <OverlayLayer aria-hidden>
          <SpotDim $rect={sirenRect} $radius={32} />
          <DottedCircle $rect={sirenRect} />
          <SpotBubble $rect={sirenRect}>클릭</SpotBubble>
        </OverlayLayer>
      )}
      {highlightPlayBtn && playRect && (
        <OverlayLayer aria-hidden>
          <SpotDim $rect={playRect} $radius={28} />
          <DottedCircle $rect={playRect} />
          <SpotBubble $rect={playRect}>클릭</SpotBubble>
        </OverlayLayer>
      )}
    </Page>
  );
}

/* ---------- styled ---------- */
const Page = styled.section`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Body = styled.div<{ $sheetHeight: number; $shrink: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const OverlayLayer = styled.div`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 999;
`;

/* === 기존 하이라이트 스타일 재사용 === */
const DottedCircle = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - 6}px;
  top: ${p => p.$rect.y - 6}px;
  width: ${p => p.$rect.width + 12}px;
  height: ${p => p.$rect.height + 12}px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 1000;
`;

const SpotBubble = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - 35}px;
  top: ${p => p.$rect.y + 20}px;
  transform: translateX(-50%);
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 10px 14px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  pointer-events: none;
  z-index: 1000;
`;

const SpotDim = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: absolute;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;

  /* pill/원형 등 원하는 반경값 */
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : "16px")};

  /* 컨테이너 내부만 투명하고 나머지를 어둡게 */
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.45);

  pointer-events: none;
  z-index: 5;
  transition:
    left 0.06s linear,
    top 0.06s linear,
    width 0.06s linear,
    height 0.06s linear;
`;
