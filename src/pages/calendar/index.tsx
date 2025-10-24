import "./styles/calendar.css";

import CustomCalendar from "./components/CustomCalendar";
import GoalList from "./components/GoalList";
import { useInitAllTodo } from "./hooks/useInitAllTodo";
import { Main, Page, Title } from "./styles";
import { ToDo } from "./styles/Goal";

const CalendarScreen = () => {
  useInitAllTodo();

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
