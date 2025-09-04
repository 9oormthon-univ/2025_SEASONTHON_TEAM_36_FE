import './styles/index.css';
import CustomCalendar from './components/CustomCalendar';
import ToDoList from './components/ToDoList';
import Modal from './components/Modal';
import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { dummy9 } from './utils/dummy';

const CalendarScreenStyle = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const CalendarScreen = () => {
  const [open, setOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
  );
  const [day, setDay] = useState(new Date().getDate());
  const [allToDo, setAllToDo] = useState({});
  const [allToDoOfMonth, setAllToDoOfMonth] = useState(dummy9);
  const [toDo, setToDo] = useState(dummy9[new Date().getDate()] ?? {});
  const modalRef = useRef(null);

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

  const handleMovePrev = useCallback(() => {
    const prevDate = new Date(yearMonth);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;
    const nextYear = prevMonth - 1 <= 0 ? prevYear - 1 : prevYear;
    const nextMonth = prevMonth - 1 <= 0 ? 12 : prevMonth - 1;
    setYearMonth(`${nextYear}-${nextMonth}`);
    setDay(1);
    setToDo(allToDoOfMonth[1] ?? {});
    console.log(`${nextYear}-${nextMonth}`);
  }, [yearMonth, setYearMonth, setDay]);

  const handleMoveNext = useCallback(() => {
    const prevDate = new Date(yearMonth);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;
    const nextYear = prevMonth + 1 > 12 ? prevYear + 1 : prevYear;
    const nextMonth = prevMonth + 1 > 12 ? 1 : prevMonth + 1;
    setYearMonth(`${nextYear}-${nextMonth}`);
    setDay(1);
    setToDo(allToDoOfMonth[1] ?? {});
    console.log(`${nextYear}-${nextMonth}`);
  }, [yearMonth, setYearMonth, setDay]);

  return (
    <CalendarScreenStyle>
      <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <CustomCalendar
          curDate={new Date(`${yearMonth}-${day}`)}
          allToDo={allToDoOfMonth}
          maxSteps={6} // 하드코딩
          handleToDo={handleToDo}
          handleMovePrev={handleMovePrev}
          handleMoveNext={handleMoveNext}
        />
        <ToDoList toDo={toDo} handleShowModal={handleShowModal} />
      </div>
      <Modal open={open} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
