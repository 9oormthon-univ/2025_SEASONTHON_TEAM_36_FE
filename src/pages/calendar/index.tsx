import "./styles/calendar.css";

import { useEffect } from "react";

import CustomCalendar from "./components/CustomCalendar";
import GoalList from "./components/GoalList";
import { useInitAllTodo } from "./hooks/useInitAllTodo";
import { Main, Page, Title } from "./styles";
import { ToDo } from "./styles/Goal";

const CalendarScreen = () => {
  useInitAllTodo();

  useEffect(() => {
    const rootElement = document.querySelector("#root") as HTMLElement;
    if (rootElement) {
      const originalOverflow = rootElement.style.overflow;
      rootElement.style.overflow = "hidden";

      return () => {
        rootElement.style.overflow = originalOverflow || "auto";
      };
    }
  }, []);

  return (
    <Page>
      <Main>
        <CustomCalendar />
        <ToDo>
          <Title $fontSize={"var(--fs-lg)"}>Task To-Do</Title>
          <GoalList />
        </ToDo>
      </Main>
    </Page>
  );
};

export default CalendarScreen;
