import "./styles/charts.css";

import { memo, useMemo, useState } from "react";

import DetailTriImg from "@/assets/images/details-tri.svg";
import PageSwiper from "@/common/components/PageSwiper";
import { useDate } from "@/common/hooks/useDate";
import { useSwipeGesture } from "@/common/hooks/useSwipeGesture";

import AchievedGoals from "./components/AchievedGoals";
import Chart1 from "./components/Chart1";
import Chart2 from "./components/Chart2";
import Modal from "./components/Modal";
import Section from "./components/Section";
import { useStatistics } from "./hooks/useStatistics";
import { Center, DatePickerButton, Header, HeaderTitle, Page, SizedBox, Wrapper } from "./styles";
import MyNavButton from "./user/MyNavButton";

// 메모이제이션된 컴포넌트들
const MemoizedChart1 = memo(Chart1);
const MemoizedChart2 = memo(Chart2);
const MemoizedAchievedGoals = memo(AchievedGoals);

export default function Profile() {
  const { date, setDate, handleMoveMonth } = useDate("profile");
  const year = useMemo(() => Number(date.split("-")[0]), [date]);
  const month = useMemo(() => Number(date.split("-")[1]), [date]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // 통계 데이터를 Profile에서 한 번만 호출
  const { focusTime, achievementRate } = useStatistics({ date });

  // swipeGesture 설정을 useMemo로 메모이제이션
  const swipeConfig = useMemo(
    () => ({
      onSwipeLeft: () => {
        handleMoveMonth(1);
      },
      onSwipeRight: () => {
        handleMoveMonth(-1);
      },
      minSwipeDistance: 50,
    }),
    [handleMoveMonth],
  );

  const { swipeHandlers, dragOffset, isDragging, isTransitioning } = useSwipeGesture(swipeConfig);

  return (
    <>
      <Modal open={modalOpen} date={date} setDate={setDate} setModalOpen={setModalOpen} />
      <Page>
        <Wrapper>
          <Header>
            <div></div>
            <Center>
              <HeaderTitle>{`${year}년 ${Number(month)}월 리포트`}</HeaderTitle>
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
          <PageSwiper
            $dragOffset={dragOffset}
            $isDragging={isDragging}
            $isTransitioning={isTransitioning}
            {...swipeHandlers}
          >
            <Section title="이번 달 달성 과제">
              <MemoizedAchievedGoals year={year} month={month} />
            </Section>
            <Section title="달성률 변화 추이">
              <MemoizedChart1 achievementRate={achievementRate} />
            </Section>
            <Section title="집중시간">
              <MemoizedChart2 focusTime={focusTime} />
            </Section>
          </PageSwiper>
        </Wrapper>
      </Page>
    </>
  );
}
