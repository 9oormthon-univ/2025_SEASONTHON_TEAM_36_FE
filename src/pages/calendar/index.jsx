import './styles/index.css';

import { useCallback, useState } from 'react';
import styled from 'styled-components';

import CustomCalendar from './components/CustomCalendar';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';

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
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(new Date().getDate());
  const [toDo, setToDo] = useState({});

  const handleShowModal = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleToDo = useCallback(selectedDate => {
    const date = new Date(selectedDate);
    const dayOfSelectedDate = date.getDate();
    setDate(date);
    setDay(dayOfSelectedDate);
  }, []);

  const handleMoveMonth = useCallback(
    move => {
      const prevDate = new Date(date);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth();
      const tmp = prevMonth + move;
      const nextYear = tmp < 0 ? prevYear - 1 : tmp > 12 ? prevYear + 1 : prevYear;
      const nextMonth = tmp < 0 ? 11 : tmp >= 12 ? 0 : tmp;
      setDate(new Date(nextYear, nextMonth, 1));
      setDay(1);
    },
    [date],
  );

  return (
    <CalendarScreenStyle>
      <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <CustomCalendar curDate={date} handleToDo={handleToDo} handleMoveMonth={handleMoveMonth} />
        <ToDoList toDo={toDo} handleShowModal={handleShowModal} />
      </div>
      <Modal open={open} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
