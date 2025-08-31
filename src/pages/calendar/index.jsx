
import './styles/index.css';
import CustomCalendar from './components/CustomCalendar';
import ToDoList from './components/ToDoList';

const CalendarScreen = () => {
  return (
    <>
      <CustomCalendar />
      <ToDoList />
    </>
  );
};

export default CalendarScreen;
