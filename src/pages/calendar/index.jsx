import './styles/index.css';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { fetchTodos } from '../../apis/todo';
import CustomCalendar from './components/CustomCalendar';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';

const CalendarScreenStyle = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const CalendarScreen = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(new Date().getDate());
  const [allToDo, setAllToDo] = useState(null);
  const [curToDo, setCurToDo] = useState({});

  useEffect(() => {
    try {
      fetchTodos().then(resp => {
        const tmpAllToDo = {};
        resp.contents.forEach(content => {
          const goalId = content.id;
          const goalTitle = content.title;
          const goalSteps = content.stepResponses;
          goalSteps.forEach(step => {
            const stepDate = new Date(step.stepDate);
            const year = stepDate.getFullYear();
            const month = stepDate.getMonth();
            const day = stepDate.getDate();
            if (!tmpAllToDo[year][month][day][goalId]) {
              tmpAllToDo[year][month][day][goalId] = {
                name: goalTitle,
                steps: [],
              };
            }
            tmpAllToDo[year][month][day][goalId]['steps'].push({
              id: step.stepId,
              name: step.description,
              done: step.isCompleted,
            });
          });
        });
        setAllToDo(tmpAllToDo);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setAllToDo]);

  const handleShowModal = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleToDo = useCallback(
    selectedDate => {
      const date = new Date(selectedDate);
      const dayOfSelectedDate = date.getDate();
      setDate(date);
      setDay(dayOfSelectedDate);
      setCurToDo(allToDo[date.getFullYear()][date.getMonth()][date.getDate()]);
    },
    [allToDo],
  );

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
        <ToDoList toDo={curToDo} handleShowModal={handleShowModal} />
      </div>
      <Modal open={open} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
