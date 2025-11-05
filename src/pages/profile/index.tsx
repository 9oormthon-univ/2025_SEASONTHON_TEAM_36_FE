import "./styles/charts.css";

import { useEffect, useState } from "react";

import AchievedGoals from "./components/AchievedGoals";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Section from "./components/Section";
import { useMoveDate } from "./hooks/useMoveDate";
import { useStatistics } from "./hooks/useStatistics";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import { ContentWrapper, Header, HeaderTitle, Page, SizedBox, Wrapper } from "./styles";
import MyNavButton from "./user/MyNavButton";

export default function Profile() {
  const { year, month, handleMoveMonth } = useMoveDate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 통계 데이터를 Profile에서 한 번만 호출
  const { clickedSubject, subjects, handleSubjectNumber, focusTime, achievementRate } =
    useStatistics({ year, month });

  const { swipeHandlers, dragOffset, isDragging } = useSwipeGesture({
    onSwipeLeft: () => {
      setIsTransitioning(true);
      handleMoveMonth(1);
    },
    onSwipeRight: () => {
      setIsTransitioning(true);
      handleMoveMonth(-1);
    },
    minSwipeDistance: 50,
  });

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <Page {...swipeHandlers}>
      <Wrapper>
        <Header>
          <div></div>
          <HeaderTitle>{`${year}년 ${month}월 리포트`}</HeaderTitle>
          <MyNavButton />
        </Header>
        <SizedBox />
        <ContentWrapper
          $dragOffset={dragOffset}
          $isDragging={isDragging}
          $isTransitioning={isTransitioning}
        >
          <Section title="이번 달 달성 과제">
            <AchievedGoals
              clickedSubject={clickedSubject}
              subjects={subjects}
              handleSubjectNumber={handleSubjectNumber}
            />
          </Section>
          <Section title="달성률 변화 추이">
            <Chart1 achievementRate={achievementRate} />
          </Section>
          <Section title="집중시간">
            <Chart2 focusTime={focusTime} />
          </Section>
        </ContentWrapper>
      </Wrapper>
    </Page>
  );
}
