// src/pages/home/components/GoalCard.tsx
import React from "react";
import styled from "styled-components";

import sirenIcon from "@/assets/images/siren.svg";
import type { HomeGoal } from "@/pages/home/types/home";

import AdjustGoalModal from "../modals/AdjustGoalModal";
import GoalStepsModal from "../modals/GoalStepsModal";
import { pickRandomFrog } from "../store/frogs";
import { DDayIcon } from "../styles/DDayIcon";
import FrogBar from "./FrogBar";

// 비동기/동기 핸들러 허용
type Voidish = void | Promise<void>;

export interface GoalCardProps {
  goal: HomeGoal;
  shrink?: number; // default 1
  onDeleted?: () => Voidish;
  onGoalAdjusted?: () => Voidish;
}

// styled-components transient props
interface ContainerProps {
  $shrink: number;
}

export default function GoalCard({ goal, shrink = 1, onDeleted, onGoalAdjusted }: GoalCardProps) {
  if (!goal) return null;

  const { id: goalId, dDay, title, progress, warmMessage } = goal;

  // 개구리 이미지 경로 저장
  const frogRef = React.useRef<string | null>(null);
  if (frogRef.current == null) {
    frogRef.current = pickRandomFrog();
  }

  const { sign, num } = React.useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+)/i.exec(String(dDay));
    if (!m) return { sign: 0, num: null as number | null };
    const s = m[1] === "+" ? 1 : m[1] === "-" ? -1 : 0;
    const n = parseInt(m[2], 10);
    return { sign: s, num: Number.isNaN(n) ? null : n };
  }, [dDay]);
  const isUrgent = sign <= 0 && num != null && num <= 3;

  const [openSteps, setOpenSteps] = React.useState(false);
  const [openAdjust, setOpenAdjust] = React.useState(false);
  const anyOpen = openSteps || openAdjust;

  const openStepsModal = () => setOpenSteps(true);
  const closeStepsModal = () => setOpenSteps(false);
  const openAdjustModal = () => setOpenAdjust(true);
  const closeAdjustModal = () => setOpenAdjust(false);

  React.useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        openAdjust ? closeAdjustModal() : closeStepsModal();
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

  const onSirenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openAdjustModal();
  };

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
        <HeaderRow>
          <DDayIcon>{dDay}</DDayIcon>
          <TitleWrap>
            <TaskTitle>{title}</TaskTitle>
            {isUrgent && (
              <SirenButton
                type="button"
                title="마감 임박: 목표 조정"
                aria-label="마감 임박: 목표 조정"
                onClick={onSirenClick}
              >
                <SirenIcon src={sirenIcon} alt="" aria-hidden="true" />
              </SirenButton>
            )}
          </TitleWrap>
        </HeaderRow>

        <CheerMsg className="typo-label-l">{warmMessage || "파이팅! 오늘도 한 걸음."}</CheerMsg>

        <ImgContainer>
          <FrogBar progress={progress ?? 0} />
          <Illust aria-hidden="true">
            {/* frogRef.current는 null 아님이 보장된 상태 */}
            {frogRef.current && <img src={frogRef.current} alt="" />}
          </Illust>
        </ImgContainer>
      </Container>

      <GoalStepsModal
        open={openSteps}
        onClose={closeStepsModal}
        goalId={goalId}
        onDeleted={onDeleted}
      />

      <AdjustGoalModal
        open={openAdjust}
        onClose={closeAdjustModal}
        goal={goal}
        onUpdated={onGoalAdjusted}
      />
    </>
  );
}

const Container = styled.div<ContainerProps>`
  background: var(--bg-1);
  color: inherit;
  width: ${p => 80 * p.$shrink}%;
  aspect-ratio: 327 / 368;
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
  &:focus-visible {
    outline: 2px solid var(--brand-1, #18a904);
    outline-offset: 2px;
    border-radius: clamp(12px, 4vw, 16px);
  }
  &:active {
    transform: scale(0.996);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

const TitleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0;
`;

const TaskTitle = styled.h3`
  display: inline-block;
  font-size: clamp(12px, 4vw, 30px);
  font-weight: 700;
  color: var(--text-1);
`;

const SirenButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  margin-left: 6px;
  border-radius: 9999px;
  line-height: 0;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid var(--brand-1, #18a904);
    outline-offset: 2px;
  }
  &:active {
    transform: scale(0.96);
  }
`;

const SirenIcon = styled.img`
  width: clamp(14px, 6vw, 50px);
  height: auto;
  display: block;
`;

const CheerMsg = styled.p`
  font-size: clamp(10px, 3.5vw, 24px);
  font-weight: 500;
  color: var(--text-2, #6f737b);
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-height: 1.6;
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
