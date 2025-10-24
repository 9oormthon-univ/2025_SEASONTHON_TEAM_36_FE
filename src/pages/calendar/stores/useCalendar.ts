import { create } from "zustand";
import { combine } from "zustand/middleware";

import { deleteStep, modifyStep } from "@/apis/step";
import { deleteTodo } from "@/apis/todo";
import { dateToFormatString } from "@/common/utils/dateUtils";

import type { CalendarState } from "../types/state";
import type { CustomStepType, Goal, Goals } from "../types/ToDo";

// 스토어 생성
export const useCalendar = create<CalendarState>(
  combine(
    // 초기 상태
    {
      curDate: new Date(),
      allToDo: {} as Goals,
      curToDo: {} as Goal,
    },
    // 액션 구현
    set => ({
      initAllTodo: (todoIds, todoTitle, todos) => {
        const updatedAllToDo = {} as Goals;
        todos.forEach((todo, index) => {
          todo.forEach(step => {
            if (!(step.stepDate in updatedAllToDo)) {
              updatedAllToDo[step.stepDate] = {};
            }
            if (!(todoIds[index] in updatedAllToDo[step.stepDate])) {
              updatedAllToDo[step.stepDate][todoIds[index]] = {
                title: todoTitle[index],
                steps: [],
              };
            }
            updatedAllToDo[step.stepDate][todoIds[index]].steps.push({
              id: step.stepId,
              name: step.description,
              done: step.isCompleted,
            });
          });
        });
        set(state => ({
          ...state,
          allToDo: updatedAllToDo,
          curToDo: updatedAllToDo[dateToFormatString(state.curDate)],
        }));
      },
      handleModifyStep: (goalId, stepId, description) => {
        modifyStep(stepId, description)
          .then(_ => {
            set(state => {
              const tmpAllToDo: Goals = { ...state.allToDo };
              const steps = tmpAllToDo[dateToFormatString(state.curDate)][goalId].steps;
              steps.forEach((step: CustomStepType) => {
                if (step.id === stepId && typeof description === "string") step.name = description;
              });
              tmpAllToDo[dateToFormatString(state.curDate)][goalId].steps = steps;
              return { ...state, allToDo: tmpAllToDo };
            });
          })
          .catch(() =>
            set(state => ({
              ...state,
            })),
          );
      },
      handleDeleteStep: (goalId, stepId) => {
        // Step 삭제 API 호출
        deleteStep(stepId)
          .then(() => {
            set(state => {
              const dateString = dateToFormatString(state.curDate);
              const updatedAllToDo = { ...state.allToDo };
              if (!updatedAllToDo[dateString] || !updatedAllToDo[dateString][goalId]) {
                return state;
              }
              const currentSteps = updatedAllToDo[dateString][goalId].steps;
              const filteredSteps = currentSteps.filter(
                (step: CustomStepType) => step.id !== stepId,
              );
              updatedAllToDo[dateString][goalId].steps = filteredSteps;
              if (filteredSteps.length === 0) {
                // ToDo 삭제 API 호출
                deleteTodo(goalId)
                  .then(() => {
                    const newGoal = { ...updatedAllToDo[dateString] };
                    delete newGoal[goalId];
                    updatedAllToDo[dateString] = newGoal;
                    return {
                      ...state,
                      allToDo: updatedAllToDo,
                    };
                  })
                  .catch((error: unknown) => {
                    console.error("Failed to delete todo:", error);
                  });
              }
              return {
                ...state,
                allToDo: updatedAllToDo,
              };
            });
          })
          .catch((error: unknown) => {
            console.error("Failed to delete step:", error);
          });
      },
      handleToDo: selectedDate => {
        set(state => {
          const date = new Date(selectedDate);
          const dateString = dateToFormatString(date);
          const currentToDo = state.allToDo[dateString] || {};
          return {
            ...state,
            curDate: date,
            curToDo: currentToDo,
          };
        });
      },
      handleMoveMonth: offset => {
        set(state => {
          const newDate = new Date(state.curDate);
          newDate.setMonth(newDate.getMonth() + offset);
          newDate.setDate(1);

          const dateString = dateToFormatString(newDate);
          const currentToDo = state.allToDo[dateString] || {};

          return {
            ...state,
            curDate: newDate,
            curToDo: currentToDo,
          };
        });
      },
    }),
  ),
);
