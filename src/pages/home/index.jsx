// src/pages/HomePage.jsx
import React from "react";
import styled from "styled-components";
import frogWell from "@/assets/images/frog-well.svg"; // ← 이미지 경로에 맞게 수정

export default function HomePage() {
  const now = new Date();
  const year = `${now.getFullYear()}년`;
  const days = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;

  return (
    <Page>
      <TopSpacing />
      <DateBox>
        <Year className="typo-label-l">{year}</Year>
        <DateLine className="typo-h2">{dateStr}</DateLine>
      </DateBox>

      <Illust>
        <img src={frogWell} alt="우물 속 개구리 캐릭터" />
      </Illust>

      <EmptyState>
        <p className="typo-body-m">아직 업무가 없어요!</p>
        <p className="typo-body-m sub">캘린더에서 업무를 추가해 주세요.</p>
      </EmptyState>
    </Page>
  );
}


const Page = styled.section`
  min-height: 100%;
  background: var(--bg-1);
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  text-align: center;
`;

const TopSpacing = styled.div`
  height: calc(16px + env(safe-area-inset-top, 0px));
`;

const DateBox = styled.header`
  display: grid;
  gap: 6px;
  margin: 18px 0 8px;
`;

const Year = styled.div`
  /* Label L: 16px, Medium, LH 100% */
  font-weight: var(--fw-b); /* 디자인 상 연도는 굵게 보이므로 Bold로 살짝 강화 */
  color: var(--text-1);
`;

const DateLine = styled.h1`
  /* Headline 2: 24px Bold, LH 48 */
  color: var(--text-1);
`;

const Illust = styled.figure`
  margin: 18px 0 16px;
  width: 100%;
  display: flex;
  justify-content: center;

  img {
    width: clamp(200px, 68vw, 320px);
    height: auto;
    display: block;
    user-select: none;
    pointer-events: none;
  }
`;

const EmptyState = styled.div`
  margin-top: 4px;
  color: var(--text-3);

  .sub { margin-top: 4px; }
`;
