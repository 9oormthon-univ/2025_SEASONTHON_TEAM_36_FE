import React, { forwardRef, useRef } from "react";
import styled from "styled-components";

import { RespTodo } from "@/common/types/response/todo";
import { getFrogByTodoType } from "@/pages/home/utils/selectFrog";

import OnbFrogBar from "./OnbFrogBar";
import OnbGoalHeader from "./OnbGoalHeader";

export interface GoalCardOwnProps {
  goal: RespTodo;
  shrink?: number; // default 1
  isUrgent?: boolean;
  sirenRef?: React.Ref<HTMLButtonElement>;
}

// 🔹 div의 표준 속성(className, onClick, aria-*, style 등)까지 받도록 확장
type GoalCardProps = React.HTMLAttributes<HTMLDivElement> & GoalCardOwnProps;

// styled-components transient props
interface ContainerProps {
  $shrink: number;
}

const OnbGoalCard = forwardRef<HTMLDivElement, GoalCardProps>(
  ({ goal, shrink = 1, isUrgent, sirenRef, onClick, onKeyDown, role, tabIndex, ...rest }, ref) => {
    const frogRef = useRef<string | null>(null);

    const progress = goal?.progress ?? 0;
    const warmMessage = goal?.warmMessage;

    // 개구리 이미지 1회 선택 (todoType이 바뀌어도 유지)
    if (frogRef.current == null) {
      frogRef.current = getFrogByTodoType(goal?.todoType);
    }

    const openStepsModal = () => {
      // TODO: 단계 모달/시트 열기 로직 연결
    };

    const onSirenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // openChatScene();
    };

    const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
      openStepsModal();
      onClick?.(e); // 🔹 외부 onClick도 호출
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openStepsModal();
      }
      onKeyDown?.(e); // 🔹 외부 onKeyDown도 호출
    };

    return (
      <Container
        ref={ref}
        role={role ?? "button"}
        tabIndex={tabIndex ?? 0}
        aria-label={rest["aria-label"] ?? "Task card"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        $shrink={shrink}
        {...rest} // 🔹 className, style 등 전달
      >
        <OnbGoalHeader onSirenClick={onSirenClick} isUrgent={isUrgent} sirenRef={sirenRef} />
        {warmMessage ? <CheerMsg className="typo-label-xs">{warmMessage}</CheerMsg> : null}

        <ImgContainer>
          <OnbFrogBar progress={progress} />
          <Illust aria-hidden="true">
            {frogRef.current && <img src={frogRef.current} alt="" />}
          </Illust>
        </ImgContainer>
      </Container>
    );
  },
);

OnbGoalCard.displayName = "OnbGoalCard";
export default OnbGoalCard;

/* ===== styled-components ===== */
const Container = styled.div<ContainerProps>`
  background: var(--bg-1);
  color: inherit;
  width: ${p => 84 * p.$shrink}%;
  aspect-ratio: 4 / 4.2; /* 🔹 기존 4/5 → 높이 축소 */
  max-height: calc(100% - 16px); /* 🔹 여백도 조금 줄임 */
  margin: 20px auto 0;
  padding: clamp(10px, 3.5vw, 28px) clamp(10px, 2.8vw, 28px);
  border-radius: clamp(10px, 3.2vw, 14px);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
    0.27px 0.27px 4.495px 0 var(--natural-400);
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 2vw, 12px);
  text-align: center;
  cursor: pointer;
  transition:
    width 0.25s ease,
    transform 0.1s ease;
  &:active {
    transform: scale(0.98);
  }
`;

const CheerMsg = styled.p`
  font-weight: 500;
  color: var(--text-2, #6f737b);
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-height: 1.1;
  font-size: 11px;
  text-align: center;
`;

const ImgContainer = styled.div`
  position: relative;
  flex: 1 0 70%;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  border-radius: 12px;
  overflow: hidden;
`;

const Illust = styled.figure`
  margin: 0;
  width: 90%;
  height: 90%;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 3%;
  img {
    display: block;
    max-width: 85%;
    max-height: 96%;
    height: auto;
    object-fit: contain;
  }
`;
