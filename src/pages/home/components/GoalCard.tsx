import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { RespTodo } from "@/common/types/response/todo";

import AdjustGoalModal from "../modals/AdjustGoalModal";
import GoalStepsModal from "../modals/GoalStepsModal";
import { pickRandomFrog } from "../store/frogs";
import { useGoalsStore } from "../store/useGoalsStore"; // reloadTodos 불러오기
import { DDayIcon } from "../styles/DDayIcon";
import FrogBar from "./FrogBar";

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
  const dDay = goal?.dDay ?? "";
  const title = goal?.title ?? "";
  const progress = goal?.progress ?? 0;
  const warmMessage = goal?.warmMessage;

  // 개구리 이미지 1회 선택
  if (frogRef.current == null) {
    frogRef.current = pickRandomFrog();
  }

  // ===== D-Day 파싱 & 긴급 판단 =====
  const { num, isDay } = useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+|day)/i.exec(String(dDay));
    if (!m) return { num: null as number | null, isDay: false };
    const val = m[2]?.toLowerCase();
    if (val === "day") return { num: 0, isDay: true };
    const n = parseInt(val, 10);
    return { num: Number.isNaN(n) ? null : n, isDay: false };
  }, [dDay]);

  // 부호와 무관: D-day 또는 숫자 ≤ 3 이면 긴급
  const isUrgent = isDay || (num != null && num <= 3);

  const anyOpen = openSteps || openAdjust;

  const openStepsModal = () => setOpenSteps(true);
  const closeStepsModal = () => setOpenSteps(false);
  const openAdjustModal = () => setOpenAdjust(true);
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

  const onSirenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openAdjustModal();
  };

  // ✅ 삭제 또는 수정 후 store에서 직접 reloadTodos 호출
  const handleGoalDeleted = async () => {
    closeStepsModal();
    await reloadTodos();
  };

  const handleGoalAdjusted = async () => {
    closeAdjustModal();
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
        <HeaderRow>
          <DDayIcon $dDay={dDay}>{dDay}</DDayIcon>
          <TitleWrap>
            <TaskTitle>{title}</TaskTitle>
            {isUrgent && (
              <SirenButton
                type="button"
                title="마감 임박: 목표 조정"
                aria-label="마감 임박: 목표 조정"
                onClick={onSirenClick}
              >
                {isUrgent ? siren : graySiren}
              </SirenButton>
            )}
          </TitleWrap>
        </HeaderRow>

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

      <AdjustGoalModal
        open={openAdjust}
        onClose={closeAdjustModal}
        goal={goal}
        onUpdated={handleGoalAdjusted}
      />
    </>
  );
}

/* ===== styled-components ===== */
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

// ========== 아이콘 svg ==========
const siren = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M8.69684 9.11231C8.69684 8.54169 8.90183 8.05319 9.31182 7.6468C9.7212 7.24042 10.2136 7.03722 10.789 7.03722C10.9167 7.03722 11.0234 6.99407 11.1091 6.90776C11.1948 6.82144 11.238 6.71445 11.2386 6.58678C11.2391 6.45911 11.196 6.35242 11.1091 6.26671C11.0222 6.181 10.9155 6.13814 10.789 6.13814C9.96665 6.13814 9.26237 6.42705 8.67616 7.00486C8.09056 7.58207 7.79776 8.28455 7.79776 9.11231V11.1865C7.79776 11.3142 7.84092 11.4212 7.92723 11.5075C8.01354 11.5938 8.12053 11.6366 8.2482 11.636C8.37587 11.6354 8.48256 11.5926 8.56827 11.5075C8.65399 11.4224 8.69684 11.3154 8.69684 11.1865V9.11231ZM4.15018 17.9818C3.75039 17.9818 3.40844 17.8394 3.12433 17.5547C2.84022 17.27 2.69787 16.9286 2.69727 16.5306V15.164C2.69727 14.7648 2.83962 14.4232 3.12433 14.1391C3.40904 13.855 3.75069 13.7126 4.14928 13.712H5.23897V9.11321C5.23897 7.57637 5.77752 6.2727 6.85462 5.2022C7.93172 4.13169 9.24319 3.59644 10.789 3.59644C12.3348 3.59644 13.6463 4.13169 14.7234 5.2022C15.8005 6.2727 16.339 7.57608 16.339 9.11231V13.7111H17.4287C17.8279 13.7111 18.1696 13.8535 18.4537 14.1382C18.7378 14.4229 18.8802 14.7645 18.8808 15.1631V16.5297C18.8808 16.9289 18.7384 17.2706 18.4537 17.5547C18.169 17.8388 17.8273 17.9812 17.4287 17.9818H4.15018Z"
      fill="#FF0000"
    />
    <rect x="2.69727" y="13.1865" width="16.1835" height="5.3945" rx="1.79817" fill="#6F737B" />
  </svg>
);

const graySiren = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M8.69684 9.11231C8.69684 8.54169 8.90183 8.05319 9.31182 7.6468C9.7212 7.24042 10.2136 7.03722 10.789 7.03722C10.9167 7.03722 11.0234 6.99407 11.1091 6.90776C11.1948 6.82144 11.238 6.71445 11.2386 6.58678C11.2391 6.45911 11.196 6.35242 11.1091 6.26671C11.0222 6.181 10.9155 6.13814 10.789 6.13814C9.96665 6.13814 9.26237 6.42705 8.67616 7.00486C8.09056 7.58207 7.79776 8.28455 7.79776 9.11231V11.1865C7.79776 11.3142 7.84092 11.4212 7.92723 11.5075C8.01354 11.5938 8.12053 11.6366 8.2482 11.636C8.37587 11.6354 8.48256 11.5926 8.56827 11.5075C8.65399 11.4224 8.69684 11.3154 8.69684 11.1865V9.11231ZM4.15018 17.9818C3.75039 17.9818 3.40844 17.8394 3.12433 17.5547C2.84022 17.27 2.69787 16.9286 2.69727 16.5306V15.164C2.69727 14.7648 2.83962 14.4232 3.12433 14.1391C3.40904 13.855 3.75069 13.7126 4.14928 13.712H5.23897V9.11321C5.23897 7.57637 5.77752 6.2727 6.85462 5.2022C7.93172 4.13169 9.24319 3.59644 10.789 3.59644C12.3348 3.59644 13.6463 4.13169 14.7234 5.2022C15.8005 6.2727 16.339 7.57608 16.339 9.11231V13.7111H17.4287C17.8279 13.7111 18.1696 13.8535 18.4537 14.1382C18.7378 14.4229 18.8802 14.7645 18.8808 15.1631V16.5297C18.8808 16.9289 18.7384 17.2706 18.4537 17.5547C18.169 17.8388 17.8273 17.9812 17.4287 17.9818H4.15018Z"
      fill="#969BA5"
    />
    <rect x="2.69727" y="13.1865" width="16.1835" height="5.3945" rx="1.79817" fill="#6F737B" />
  </svg>
);
