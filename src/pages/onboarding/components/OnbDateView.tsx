import styled from "styled-components";

export default function OnbDateView() {
  const now = new Date();
  const year = `${now.getFullYear()}년`;
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;

  return (
    <DateBox>
      <Year className="typo-h3">{year}</Year>
      <DateLine className="typo-h2">{dateStr}</DateLine>
    </DateBox>
  );
}

const DateBox = styled.header`
  display: grid;
  gap: 8px;
  margin: 5vh 0 4px;
  text-align: center;
  @media (min-width: 375px) {
    gap: 12px;
  }
`;

const Year = styled.h2`
  color: var(--text-1);
`;

const DateLine = styled.h1`
  color: var(--text-1);
`;
