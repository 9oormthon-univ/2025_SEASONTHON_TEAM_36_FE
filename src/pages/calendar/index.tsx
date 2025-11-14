import "./styles/calendar.css";

import { useEffect } from "react";

import ContentWrapper from "@/common/components/PageSwiper";
import { useSwipeGesture } from "@/common/hooks/useSwipeGesture";

import CustomCalendar from "./components/CustomCalendar";
import GoalList from "./components/GoalList";
import { useInitAllTodo } from "./hooks/useInitAllTodo";
import { useCalendar } from "./stores/useCalendar";
import { Main, Page, Title } from "./styles";
import { ToDo } from "./styles/Goal";

const CalendarScreen = () => {
  const view = useCalendar(state => state.view);
  const handleMoveMonth = useCalendar(state => state.handleMoveMonth);
  const {
    swipeHandlers,
    dragOffset,
    isDragging,
    swipeStatus,
    isTransitioning,
    setIsTransitioning,
    setSwipeStatus,
  } = useSwipeGesture({
    onSwipeLeft: () => {
      setIsTransitioning(true);
    },
    onSwipeRight: () => {
      setIsTransitioning(true);
    },
    minSwipeDistance: 50,
  });
  useInitAllTodo();

  useEffect(() => {
    const calendarLeftLabelBtn = document.querySelector(
      ".react-calendar__navigation__prev-button",
    ) as HTMLElement;
    const calendarRightLabelBtn = document.querySelector(
      ".react-calendar__navigation__next-button",
    ) as HTMLElement;
    if (swipeStatus < 0) {
      calendarLeftLabelBtn?.click();
      handleMoveMonth(-1);
    } else if (swipeStatus > 0) {
      calendarRightLabelBtn?.click();
      handleMoveMonth(1);
    }
    setSwipeStatus(0);
  }, [swipeStatus, setSwipeStatus, handleMoveMonth]);

  return (
    <Page>
      <Main>
        <ContentWrapper
          $dragOffset={dragOffset}
          $isDragging={isDragging}
          $isTransitioning={isTransitioning}
          {...swipeHandlers}
        >
          <CustomCalendar />
          {view === "month" && (
            <ToDo>
              <Title $fontSize={"var(--fs-lg)"}>Task To-Do</Title>
              <GoalList />
            </ToDo>
          )}
        </ContentWrapper>
      </Main>
    </Page>
  );
};

export default CalendarScreen;
