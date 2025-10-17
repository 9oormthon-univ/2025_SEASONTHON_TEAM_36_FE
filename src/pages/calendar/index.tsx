import "./styles/calendar.css";

import CustomCalendar from "./components/CustomCalendar";
import GoalList from "./components/GoalList";
import { Main, Page, Title } from "./styles";
import { ToDo } from "./styles/Goal";

const CalendarScreen = () => {
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
