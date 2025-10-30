// react imports not needed
import "./styles/charts.css";

import styled from "styled-components";

import AchievedGoals from "./components/AchievedGoals";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Section from "./components/Section";
import { useMoveDate } from "./hooks/useMoveDate";
import { Header, HeaderTitle, Page, SizedBox, Wrapper } from "./styles";

const MyPageBtn = styled.button`
  background: var(--natural-200);
  padding: 15px 13px;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  box-shadow:
    0.3px 0.3px 5px var(--natural-400),
    -0.3px -0.3px 5px var(--natural-400);
`;

export default function Profile() {
  const { year, month } = useMoveDate();
  return (
    <Page>
      <Wrapper>
        <Header>
          <div></div>
          <HeaderTitle>{`${year}년 ${month}월 리포트`}</HeaderTitle>
          <MyPageBtn>MY</MyPageBtn>
        </Header>
        <SizedBox />
        <Section title="이번 달 달성 과제">
          <AchievedGoals />
        </Section>
        <Section title="달성률 변화 추이">
          <Chart1 />
        </Section>
        <Section title="집중시간">
          <Chart2 />
        </Section>
      </Wrapper>
    </Page>
  );
}
