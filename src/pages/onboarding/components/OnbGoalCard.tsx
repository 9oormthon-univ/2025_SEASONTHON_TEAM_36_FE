import React, { useRef, useState } from "react";
import styled from "styled-components";

import { RespTodo } from "@/common/types/response/todo";
import FrogBar from "@/pages/home/components/FrogBar";
import GoalHeader from "@/pages/home/components/GoalHeader";
import GoalStepsModal from "@/pages/home/modals/GoalStepsModal";
import { getFrogByTodoType } from "@/pages/home/utils/selectFrog";

import SceneChat from "../scenes/SceneChat";

export interface GoalCardProps {
  goal: RespTodo;
  shrink?: number; // default 1
}

// styled-components transient props
interface ContainerProps {
  $shrink: number;
}

export default function OnbGoalCard({ goal, shrink = 1 }: GoalCardProps) {
  const frogRef = useRef<string | null>(null);
  const [openSteps, setOpenSteps] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const progress = goal?.progress ?? 0;
  const warmMessage = goal?.warmMessage;

  // 개구리 이미지 1회 선택
  if (frogRef.current == null) {
    frogRef.current = getFrogByTodoType(goal?.todoType);
  }

  const openStepsModal = () => setOpenSteps(true);
  const closeStepsModal = () => setOpenSteps(false);
  const openChatScene = () => setOpenChat(true);
  const closeChatScene = () => setOpenChat(false);

  const onSirenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openChatScene();
  };

  return (
    <>
      <Container
        role="button"
        tabIndex={0}
        aria-label="Task card"
        onClick={openStepsModal}
        $shrink={shrink}
      >
        <GoalHeader onSirenClick={onSirenClick} />

        <CheerMsg className="typo-label-l">{warmMessage}</CheerMsg>

        <ImgContainer>
          <FrogBar progress={progress} />
          <Illust aria-hidden="true">
            {frogRef.current && <img src={frogRef.current} alt="" />}
          </Illust>
        </ImgContainer>
      </Container>

      <GoalStepsModal open={openSteps} onClose={closeStepsModal} onDeleted={() => {}} />

      {/* <ChatGoalModal
        open={openChat}
        onClose={closeChatModal}
        goal={goal}
        onUpdated={handleGoalChated}
      /> */}
      <SceneChat open={openChat} onClose={closeChatScene} />
    </>
  );
}

/* ===== styled-components ===== */
const Container = styled.div<ContainerProps>`
  background: var(--bg-1);
  color: inherit;
  width: ${p => 80 * p.$shrink}%;
  aspect-ratio: 4 / 5;
  max-height: calc(100% - 24px);
  margin: 0 auto 0;
  padding: clamp(12px, 4.3vw, 40px) clamp(12px, 3vw, 40px);
  border-radius: clamp(12px, 4vw, 16px);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
    0.27px 0.27px 4.495px 0 var(--natural-400);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.8vw, 16px);
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
