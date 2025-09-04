import './styles/index.css';
import CustomCalendar from './components/CustomCalendar';
import ToDoList from './components/ToDoList';
import Modal from './components/Modal';
import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { dummy } from './utils/dummy';

const CalendarScreenStyle = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const getLastDayOfMonth = date => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return 28 + (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }
};

const CalendarScreen = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(true);
  const [yearMonth, setYearMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
  );
  const [day, setDay] = useState(new Date().getDate());
  const [allToDoOfMonth, setAllToDoOfMonth] = useState(dummy);
  const [toDo, setToDo] = useState(dummy[new Date().getDate()] ?? {});

  const handleShowModal = useCallback(() => {
    setOpen(prev => !prev);
  }, [open]);

  const handleToDo = useCallback(
    selectedDate => {
      const date = new Date(selectedDate);
      const dayOfSelectedDate = date.getDate();
      setDay(dayOfSelectedDate);
      setToDo(allToDoOfMonth[dayOfSelectedDate] ?? {});
    },
    [setDay, setToDo],
  );

  const handleMoveMonth = useCallback(
    move => {
      const prevDate = new Date(yearMonth);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth() + 1;
      const tmp = prevMonth + move;
      const nextYear = tmp <= 0 ? prevYear - 1 : tmp > 12 ? prevYear + 1 : prevYear;
      const nextMonth = tmp <= 0 ? 12 : tmp > 12 ? 1 : tmp;
      console.log(nextYear, nextMonth);
      setYearMonth(`${nextYear}-${nextMonth}`);
      setDay(1);
      setToDo(allToDoOfMonth[1] ?? {});
      console.log(`${nextYear}-${nextMonth}`);
    },
    [yearMonth, setYearMonth, setDay],
  );

  const handleView = useCallback(() => {
    setView(prev => !prev);
  }, [view]);

  return (
    <CalendarScreenStyle>
      <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <CustomCalendar
          curDate={new Date(`${yearMonth}-${day}`)}
          calView={view}
          allToDo={allToDoOfMonth}
          maxSteps={6} // 하드코딩
          handleToDo={handleToDo}
          handleMoveMonth={handleMoveMonth}
          handleView={handleView}
        />
        <ToDoList toDo={toDo} handleShowModal={handleShowModal} />
      </div>
      <Modal open={open} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
