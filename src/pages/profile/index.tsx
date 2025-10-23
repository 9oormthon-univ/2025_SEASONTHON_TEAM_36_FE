// react imports not needed
import "./styles/charts.css";

import Button from "./components/Button";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Section from "./components/Section";
import { useMoveDate } from "./hooks/useMoveDate";
import { Header, HeaderWrapper, Page, SizedBox, Title, Wrapper } from "./styles";

export default function Profile() {
  const [year, month, handleMoveMonth]: [number, number, (offset: number) => void] = useMoveDate();
  return (
    <Page>
      <Wrapper>
        <HeaderWrapper>
          <Header>
            <Button move={"left"} handleMoveMonth={handleMoveMonth} />
            <Title className="typo-h3">{`${year}년 ${month}월 리포트`}</Title>
            <Button move={"right"} handleMoveMonth={handleMoveMonth} />
          </Header>
        </HeaderWrapper>
        <SizedBox />
        <Section title="이번 달 달성 과제"></Section>
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
