import styled from "styled-components";
import EmptyState from "./components/EmptyState";
import TaskCard from "./components/TaskCard";

// progress 퍼센트는 여기서 넘겨줌 

export default function HomePage() {
  const now = new Date();
  const year = `${now.getFullYear()}년`;
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;

  return (
    <Page>
      <TopSpacing />
      <DateBox>
        <Year className="typo-h2">{year}</Year>
        <DateLine className="typo-h1">{dateStr}</DateLine>
      </DateBox>
      {/* <EmptyState /> */}
        <TaskCard progress={12} />
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
`;

const TopSpacing = styled.div`
  height: calc(45px + env(safe-area-inset-top, 0px));
  @media (min-height: 700px) {
    height: calc(75px + env(safe-area-inset-top, 0px));
  }
`;

const DateBox = styled.header`
  display: grid;
  gap: 8px;
  margin: 18px 0 8px;
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