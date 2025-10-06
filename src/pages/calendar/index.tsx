import "./styles/calendar.css";

import { useCallback, useEffect, useState } from "react";

import { deleteStep, modifyStep } from "../../apis/step";
import { deleteTodo, fetchTodos } from "../../apis/todo";
import CustomCalendar from "./components/CustomCalendar";
import Modal from "./components/Modal";
import ToDoList from "./components/ToDoList";
import { Main, Page } from "./styles/Calendar";
import { dateToFormatString } from "./utils/dateUtils";

const CalendarScreen = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [allToDo, setAllToDo] = useState(null);
  const [curToDo, setCurToDo] = useState({});

  const handleModifyStep = useCallback(
    (goalId, stepId, description) => {
      modifyStep(stepId, description)
        .then(_ => {
          const tmpAllToDo = { ...allToDo };
          const steps = tmpAllToDo[dateToFormatString(date)][goalId].steps;

          steps.forEach(step => {
            if (step.id === stepId) step.name = description;
          });
          tmpAllToDo[dateToFormatString(date)][goalId].steps = steps;
          setAllToDo(tmpAllToDo);
        })
        .catch(() => setAllToDo({ ...allToDo }));
    },
    [allToDo, date],
  );

  const handleDeleteStep = useCallback(
    (goalId, stepId) => {
      const tmpAllToDo = { ...allToDo };
      const steps = tmpAllToDo[dateToFormatString(date)][goalId].steps;
      deleteStep(stepId)
        .then(_ => {
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
        })
        .catch(() => setAllToDo({ ...allToDo }));
    },
    [allToDo, date],
  );

  const handleAllToDo = useCallback(() => {
    fetchTodos()
      .then(resp => {
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
            tmpAllToDo[step.stepDate][goalId]["steps"].push({
              id: step.stepId,
              name: step.description,
              done: step.isCompleted,
            });
          });
        });
        setAllToDo(tmpAllToDo);
        const dateToString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(date.getDate()).padStart(2, "0")}`;
        setCurToDo(tmpAllToDo[dateToString]);
      })
      .catch(() => {
        setAllToDo({});
        setCurToDo({});
      });
  }, [date]);

  useEffect(() => {
    try {
      handleAllToDo();
    } catch (error) {
      console.error(error);
    }
  }, [handleAllToDo]);

  const handleShowModal = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleToDo = useCallback(
    selectedDate => {
      const date = new Date(selectedDate);
      setDate(date);
      const dateToString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;
      setCurToDo(allToDo[dateToString]);
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

  return (
    <Page>
      <Main>
        <CustomCalendar curDate={date} handleToDo={handleToDo} handleMoveMonth={handleMoveMonth} />
        <ToDoList
          toDo={curToDo}
          handleShowModal={handleShowModal}
          handleModifyStep={handleModifyStep}
          handleDeleteStep={handleDeleteStep}
        />
      </Main>
      <Modal
        open={open}
        handleAllToDo={handleAllToDo}
        handleModifyStep={handleModifyStep}
        handleShowModal={handleShowModal}
      />
    </Page>
  );
};

export default CalendarScreen;
