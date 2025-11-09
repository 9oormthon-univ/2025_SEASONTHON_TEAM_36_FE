// src/pages/home/components/GoalHeader.tsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useActiveGoalStore } from "../store/useActiveGoalStore";
import { useGoalsStore } from "../store/useGoalsStore";
import { DDayIcon } from "../styles/DDayIcon";

export default function GoalHeader() {
  const navigate = useNavigate();

  const onSirenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void navigate("/chatbot");
  };
  // ===== 스토어에서 활성 goal 가져오기 =====
  const activeId = useActiveGoalStore(s => s.activeId);
  const goals = useGoalsStore(s => s.goals);

  const activeGoal = useMemo(() => goals.find(g => g.id === activeId) ?? null, [goals, activeId]);

  // 없을 때 안전한 기본값
  const dDay = activeGoal?.dDay ?? "D-day";
  const title = activeGoal?.title ?? "목표를 선택하세요";

  // ===== D-Day 파싱 & 긴급 판단 =====
  const { num, sign, isDay } = useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+|day)/i.exec(String(dDay));
    if (!m) return { num: null as number | null, sign: null as string | null, isDay: false };
    const val = m[2]?.toLowerCase();
    const signVal = m[1] ?? null;
    if (val === "day") return { num: 0, sign: signVal, isDay: true };
    const n = parseInt(val, 10);
    return { num: Number.isNaN(n) ? null : n, sign: signVal, isDay: false };
  }, [dDay]);

  /** 긴급 판단
   * D-day → true
   * D+N (모두) → true
   * D–1~3 → true
   */
  const isUrgent =
    isDay || (num != null && ((sign === "+" && num >= 0) || (sign !== "+" && num <= 3)));
  // true;

  return (
    <HeaderRow>
      <DDayIcon $dDay={dDay}>{dDay}</DDayIcon>
      <TitleWrap>
        <TaskTitle className="typo-label-l">{title}</TaskTitle>
        <SirenButton
          type="button"
          onClick={onSirenClick}
          tabIndex={isUrgent ? 0 : -1}
          aria-label={isUrgent ? "긴급 알림" : "긴급 아님"}
        >
          {isUrgent ? siren : graySiren}
        </SirenButton>
      </TitleWrap>
    </HeaderRow>
  );
}

/* ===== styled-components (이 컴포넌트 전용) ===== */
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: center;
  width: 100%;
`;

const TitleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  word-break: keep-all;
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
  padding: 6px;
  border-radius: 9999px;
  line-height: 0;
  cursor: pointer;
  &:active {
    transform: scale(0.96);
  }
`;

/* ===== 아이콘 (내장) ===== */
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
