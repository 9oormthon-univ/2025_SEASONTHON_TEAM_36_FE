import "./styles/charts.css";

import { useEffect, useState } from "react";

import DetailTriImg from "@/assets/images/details-tri.svg";

import AchievedGoals from "./components/AchievedGoals";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Modal from "./components/Modal";
import Section from "./components/Section";
import { useMoveDate } from "./hooks/useMoveDate";
import { useStatistics } from "./hooks/useStatistics";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import {
  Center,
  ContentWrapper,
  DatePickerButton,
  Header,
  HeaderTitle,
  Page,
  SizedBox,
  Wrapper,
} from "./styles";
import MyNavButton from "./user/MyNavButton";

export default function Profile() {
  const { year, month, handleMoveMonth, setYear, setMonth } = useMoveDate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // 통계 데이터를 Profile에서 한 번만 호출
  const {
    clickedSubject,
    subjects,
    handleSubjectNumber,
    focusTime,
    achievementRate,
    setSubjects,
    setClickedSubject,
  } = useStatistics({ year, month });

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

  useEffect(() => {
    setSubjects(null);
    setClickedSubject(-1);
  }, [year, month, setSubjects, setClickedSubject]);

  return (
    <>
      <Modal
        open={modalOpen}
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
        setModalOpen={setModalOpen}
      />
      <Page>
        <Wrapper>
          <Header>
            <div></div>
            <Center>
              <HeaderTitle>{`${year}년 ${month}월 리포트`}</HeaderTitle>
              <DatePickerButton
                onClick={() => {
                  setModalOpen(prev => !prev);
                }}
              >
                <img src={DetailTriImg} alt="날짜 선택 모달 버튼" />
              </DatePickerButton>
            </Center>
            <MyNavButton />
          </Header>
          <SizedBox />
          <ContentWrapper
            $dragOffset={dragOffset}
            $isDragging={isDragging}
            $isTransitioning={isTransitioning}
            {...swipeHandlers}
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
    </>
  );
}
