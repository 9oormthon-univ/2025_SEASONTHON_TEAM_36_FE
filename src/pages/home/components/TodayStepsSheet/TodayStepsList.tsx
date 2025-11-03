// src/pages/home/components/TodayStepsList.tsx
import styled from "styled-components";

import { RespStepRecord } from "@/common/types/response/step";

import StepPlayingModal from "../../modals/StepPlayingModal";
import type { StepListItem } from "../../types/steps"; // ← 공용 타입 재사용

type PlayingModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onPause: () => void | Promise<void>;
  record?: RespStepRecord | null;
};

interface TodayStepsListProps {
  items: StepListItem[];
  onAction?: (it: { id: string | number; stepId: number | null }) => void | Promise<void>;
  playingModal?: PlayingModalProps;
}

export default function TodayStepsList({ items = [], onAction, playingModal }: TodayStepsListProps) {
  const playingItem = items.find(it => it.state === "play");
  const playingDescription = playingItem ? playingItem.description : "";

  return (
    <>
      <List role="list">
        {items.map(it => {
          const isPlaying = it.state === "play";
          return (
            <Item key={it.id} role="listitem">
              <Bullet aria-hidden="true" />
              {/* 완료된 항목(isCompleted)에는 취소선 표시 */}
              <ItemTitle $completed={it.isCompleted}>{it.description}</ItemTitle>

              <Right>
                <ActionBtnWrapper
                  aria-label={isPlaying ? "정지" : "시작"}
                  title={isPlaying ? "정지" : "시작"}
                  onClick={() => void onAction?.({ id: it.id, stepId: it.stepId })}
                  $isPlaying={isPlaying}
                  $completed={it.isCompleted}
                  $size={29}
                >
                  {/* 제공된 버튼 마크업을 styled-components로 이식 + SVG 색상은 currentColor */}
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
          );
        })}
      </List>

      {playingModal && (
        <StepPlayingModal
          open={playingModal.open}
          onClose={playingModal.onClose}
          onConfirm={playingModal.onConfirm}
          onPause={playingModal.onPause}
          record={playingModal.record}
          stepDescription={playingDescription}
        />
      )}
    </>
  );
}

/* ======================= styles ======================= */

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

/**DOM으로 전달되지 않도록 $프롭으로 정의 */
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

  /* 버튼 자체 색상 = 내부 SVG의 currentColor */
  color: ${({ $completed }) => ($completed ? "red" : "var(--green-400)")};
`;

const IconOuter = styled.div`
  /* 원래: w-7 h-7 p-1 bg-natural-200 rounded-2xl inline-flex ... */
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
