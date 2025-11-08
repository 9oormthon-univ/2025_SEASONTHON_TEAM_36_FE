// src/pages/home/components/TodayStepsSheet.tsx
import styled, { CSSProperties } from "styled-components";

import dragUp from "@/assets/images/drag-up.svg";
import BottomSheet from "@/common/components/BottomSheet";
import SheetListSection from "@/pages/home/components/TodayStepsSheet/SheetListSection";
import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";
import { StepViewItem } from "@/pages/home/types/steps";

type StepsProps = {
  todaySteps: StepViewItem[];
  onAction?: (it: { id: number | null; stepId: number | null }) => void | Promise<void>;
};

export default function OnbTodayStepsSheet({ todaySteps, onAction }: StepsProps) {
  const open = useBottomSheetStore(s => s.open);
  const peekHeight = useBottomSheetStore(s => s.peekHeightPx);

  return (
    <>
      <BottomSheet>
        {open ? (
          <SheetBody>
            <ScrollArea role="list">
              {todaySteps.map(g => (
                <SheetListSection key={g.stepId ?? `${g.description}`} title={g.description}>
                  <OnbTodayStepsList todaySteps={todaySteps} onAction={onAction} />
                </SheetListSection>
              ))}
            </ScrollArea>
          </SheetBody>
        ) : (
          <Title className="typo-h3">우물 밖으로 나갈 준비</Title>
        )}
      </BottomSheet>

      {!open && (
        <FloatingArrow
          src={dragUp}
          alt=""
          aria-hidden="true"
          style={{ "--peek": `${peekHeight}px`, "--gap": "2%" } as CSSProperties}
        />
      )}
    </>
  );
}

// --- 자식 컴포넌트도 props 객체로 받기 ---
function OnbTodayStepsList({ todaySteps, onAction }: StepsProps) {
  return (
    <>
      <List role="list">
        {todaySteps.map((it, idx) => (
          <Item key={it.stepId ?? `step-${idx}`} role="listitem">
            <Bullet aria-hidden="true" />
            <ItemTitle $completed={it.isCompleted}>{it.description}</ItemTitle>

            <Right>
              <ActionBtnWrapper
                onClick={() => void onAction?.({ id: it.stepId, stepId: it.stepId })}
                $isPlaying={false}
                $completed={it.isCompleted}
                $size={29}
              >
                <IconOuter data-property-1="기본">
                  <IconSVG
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 21 21"
                    role="img"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.0693 10.4683C18.3338 10.6212 18.3338 11.0033 18.0693 11.1548L7.94731 16.9537C7.68358 17.1044 7.35478 16.9134 7.35454 16.6092L7.35454 4.95396C7.35473 4.64973 7.68355 4.46056 7.94731 4.61284L18.0693 10.4683Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </IconSVG>
                </IconOuter>
              </ActionBtnWrapper>
            </Right>
          </Item>
        ))}
      </List>
    </>
  );
}

/* ======================= styles ======================= */

const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  margin: 0 2%;
`;

const ScrollArea = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

const FloatingArrow = styled.img`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(
    env(safe-area-inset-bottom, 0px) + var(--peek, 58px) + var(--gap, 14px) + var(--navbar-height)
  );
  width: 14px;
  height: auto;
  pointer-events: none;
  z-index: 9999;
`;

const Title = styled.h3`
  margin: 8px 30px;
  color: var(--text-1);
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 20px;
  margin-top: 4%;
  padding: 0;
  margin: 10px;
  background: transparent;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 0 2.3% 3.5% 2.3%;
  background: transparent;
  border-bottom: 1px solid var(--natural-400, #d6d9e0);
`;

const Bullet = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--icon-1);
  margin-right: 15px;
`;

const ItemTitle = styled.div<{ $completed?: boolean }>`
  color: var(--text-1, #000);
  font-size: var(--fs-lg, 16px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: var(--ls-2, 0);
  word-break: keep-all;
  overflow-wrap: anywhere;
  white-space: normal;

  ${({ $completed }) =>
    $completed &&
    `
      text-decoration: line-through;
      color: var(--text-2);
    `}
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ActionBtnWrapper = styled.button<{
  $isPlaying?: boolean;
  $completed?: boolean;
  $size?: number;
}>`
  all: unset;
  cursor: pointer;

  display: inline-flex;
  border-radius: 16px;
  width: ${({ $size }) => $size ?? 29}px;
  height: ${({ $size }) => $size ?? 29}px;

  color: ${({ $completed }) => ($completed ? "red" : "var(--green-400)")};
`;

const IconOuter = styled.div`
  width: 100%;
  height: 100%;
  background: var(--natural-200);
  border-radius: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const IconSVG = styled.svg`
  width: 21px;
  height: 21px;
`;
