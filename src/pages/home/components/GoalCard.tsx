import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { RespTodo } from "@/common/types/response/todo";

import GoalStepsModal from "../modals/GoalStepsModal";
import { useGoalsStore } from "../store/useGoalsStore"; // reloadTodos 불러오기
import { getFrogByTodoType } from "../utils/selectFrog";
import FrogBar from "./FrogBar";
import GoalHeader from "./GoalHeader";

export interface GoalCardProps {
  goal: RespTodo;
  shrink?: number; // default 1
}

// styled-components transient props
interface ContainerProps {
  $shrink: number;
}

export default function GoalCard({ goal, shrink = 1 }: GoalCardProps) {
  const frogRef = useRef<string | null>(null);
  const [openSteps, setOpenSteps] = useState(false);
  const [openAdjust, setOpenAdjust] = useState(false);

  const reloadTodos = useGoalsStore(s => s.reloadTodos);

  // goal 파생값
  const goalId = goal?.id;
  const progress = goal?.progress ?? 0;
  const warmMessage = goal?.warmMessage;

  // 개구리 이미지 1회 선택
  if (frogRef.current == null) {
    frogRef.current = getFrogByTodoType(goal?.todoType);
  }

  const anyOpen = openSteps || openAdjust;

  const openStepsModal = () => setOpenSteps(true);
  const closeStepsModal = () => setOpenSteps(false);
  const closeAdjustModal = () => setOpenAdjust(false);

  // ESC키로 모달 닫기
  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openAdjust) {
          closeAdjustModal();
        } else {
          closeStepsModal();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [anyOpen, openAdjust]);

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openStepsModal();
    }
  };

  // 삭제 또는 수정 후 store에서 직접 reloadTodos 호출
  const handleGoalDeleted = async () => {
    closeStepsModal();
    await reloadTodos();
  };

  if (!goal) return null;

  return (
    <>
      <Container
        role="button"
        tabIndex={0}
        aria-label="Task card"
        onClick={openStepsModal}
        onKeyDown={onCardKeyDown}
        data-goal-id={goalId}
        $shrink={shrink}
      >
        <GoalHeader />

        <CheerMsg className="typo-label-l">{warmMessage || "파이팅! 오늘도 한 걸음."}</CheerMsg>

        <ImgContainer>
          <FrogBar progress={progress} />
          <Illust aria-hidden="true">
            {frogRef.current && <img src={frogRef.current} alt="" />}
          </Illust>
        </ImgContainer>
      </Container>

      <GoalStepsModal
        open={openSteps}
        onClose={closeStepsModal}
        onDeleted={() => void handleGoalDeleted()}
      />
    </>
  );
}

/* ===== styled-components ===== */
const Container = styled.div<ContainerProps>`
  background: var(--bg-1);
  color: inherit;
  width: ${p => 78 * p.$shrink}%;
  aspect-ratio: 4 / 4.2;
  max-height: calc(100% - 24px);
  margin: 0 auto 0;
  padding: clamp(12px, 4%, 40px) clamp(12px, 2vw, 40px);
  border-radius: clamp(12px, 4vw, 16px);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
    0.27px 0.27px 4.495px 0 var(--natural-400);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2%, 16px);
  text-align: center;
  cursor: pointer;
  transition: width 0.25s ease;
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
  font-size: 14px;
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
  width: 100%;
  height: 100%;
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
