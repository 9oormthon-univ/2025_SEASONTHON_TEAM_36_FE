import "./styles/calendar.css";

import { useEffect } from "react";

import CustomCalendar from "./components/CustomCalendar";
import GoalList from "./components/GoalList";
import { useInitAllTodo } from "./hooks/useInitAllTodo";
import { useCalendar } from "./stores/useCalendar";
import { Main, Page, Title } from "./styles";
import { ToDo } from "./styles/Goal";

const CalendarScreen = () => {
  const view = useCalendar(state => state.view);
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
        {view === "month" && (
          <ToDo>
            <Title $fontSize={"var(--fs-lg)"}>Task To-Do</Title>
            <GoalList />
          </ToDo>
        )}
      </Main>
    </Page>
  );
};

export default CalendarScreen;
