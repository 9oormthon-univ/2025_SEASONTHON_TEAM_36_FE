import './styles/index.css';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { deleteStep, modifyStep } from '../../apis/step';
import { deleteTodo, fetchTodos } from '../../apis/todo';
import CustomCalendar from './components/CustomCalendar';
import Modal from './components/Modal';
import ToDoList from './components/ToDoList';
import { checkWeekPosition, dateToFormatString, getWeekRange } from './utils/dateUtils';

const CalendarScreenStyle = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const CalendarScreen = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDayOfWeek, setStartDayOfWeek] = useState(null);
  const [endDayOfWeek, setEndDayOfWeek] = useState(null);
  const [allToDo, setAllToDo] = useState(null);
  const [curToDo, setCurToDo] = useState({});
  const [monthMode, setMonthMode] = useState(true);

  const handleModifyStep = useCallback(
    (goalId, stepId, description) => {
      modifyStep(stepId, description).then(_ => {
        const tmpAllToDo = { ...allToDo };
        const steps = tmpAllToDo[dateToFormatString(date)][goalId].steps;

        steps.forEach(step => {
          if (step.id === stepId) step.name = description;
        });
        tmpAllToDo[dateToFormatString(date)][goalId].steps = steps;
        setAllToDo(tmpAllToDo);
      });
    },
    [allToDo, date],
  );

  const handleDeleteStep = useCallback(
    (goalId, stepId) => {
      const tmpAllToDo = { ...allToDo };
      const steps = tmpAllToDo[dateToFormatString(date)][goalId].steps;
      deleteStep(stepId).then(_ => {
        tmpAllToDo[dateToFormatString(date)][goalId].steps = steps.filter(
          step => step.id !== stepId,
        );
        setAllToDo(tmpAllToDo);
        if (tmpAllToDo[dateToFormatString(date)][goalId].steps.length === 0) {
          deleteTodo(goalId).then(_ => {
            const tmpAllToDo = { ...allToDo };
            delete tmpAllToDo[dateToFormatString(date)][goalId];
            setAllToDo(tmpAllToDo);
          });
        }
      });
    },
    [allToDo, date],
  );

  useEffect(() => {
    try {
      fetchTodos().then(resp => {
        const tmpAllToDo = {};
        resp.contents.forEach(content => {
          const goalId = content.id;
          const goalTitle = content.title;
          const goalSteps = content.stepResponses;
          goalSteps.forEach(step => {
            if (!tmpAllToDo[step.stepDate]) {
              tmpAllToDo[step.stepDate] = {};
            }
            if (!tmpAllToDo[step.stepDate][goalId]) {
              tmpAllToDo[step.stepDate][goalId] = {
                name: goalTitle,
                steps: [],
              };
            }
            tmpAllToDo[step.stepDate][goalId]['steps'].push({
              id: step.stepId,
              name: step.description,
              done: step.isCompleted,
            });
          });
        });
        setAllToDo(tmpAllToDo);
        const dateToString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(date.getDate()).padStart(2, '0')}`;
        setCurToDo(tmpAllToDo[dateToString]);
      });
      const weekRange = getWeekRange(date);
      setStartDayOfWeek(weekRange.monday);
      setEndDayOfWeek(weekRange.sunday);
    } catch (error) {
      console.log(error);
    }
  }, [date, setAllToDo]);

  const handleShowModal = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleToDo = useCallback(
    selectedDate => {
      const date = new Date(selectedDate);
      setDate(date);
      const dateToString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(date.getDate()).padStart(2, '0')}`;
      setCurToDo(allToDo[dateToString]);
      const weekRange = getWeekRange(date);
      setStartDayOfWeek(weekRange.monday);
      setEndDayOfWeek(weekRange.sunday);
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
    },
    [date],
  );

  const handleMoveWeek = useCallback(
    move => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + move * 7);
      const { monday, sunday } = getWeekRange(nextDate);
      setStartDayOfWeek(monday);
      setEndDayOfWeek(sunday);

      if (move > 0) {
        setDate(monday);
      } else {
        setDate(sunday);
      }
    },
    [date],
  );

  const handleMonthMode = useCallback(() => {
    setMonthMode(prev => !prev);
  }, []);

  return (
    <CalendarScreenStyle>
      <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <CustomCalendar
          curDate={date}
          handleToDo={handleToDo}
          handleMoveMonth={handleMoveMonth}
          handleMoveWeek={handleMoveWeek}
          startDayOfWeek={startDayOfWeek}
          endDayOfWeek={endDayOfWeek}
          monthMode={monthMode}
          handleMonthMode={handleMonthMode}
        />
        <ToDoList
          toDo={curToDo}
          handleShowModal={handleShowModal}
          handleModifyStep={handleModifyStep}
          handleDeleteStep={handleDeleteStep}
        />
      </div>
      <Modal open={open} handleModifyStep={handleModifyStep} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
