import { create } from "zustand";
import { combine } from "zustand/middleware";

import { deleteStep, fetchSteps, modifyStep } from "@/apis/step";
import { deleteTodo } from "@/apis/todo";
import { dateToFormatString } from "@/common/utils/dateUtils";

import type { CalendarState } from "../types/state";
import type { Goal, Goals } from "../types/ToDo";

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
        const newAllToDo = {} as Goals;
        todos.forEach((todo, index) => {
          todo.forEach(step => {
            if (!(step.stepDate in newAllToDo)) {
              newAllToDo[step.stepDate] = {};
            }
            if (!(todoIds[index] in newAllToDo[step.stepDate])) {
              newAllToDo[step.stepDate][todoIds[index]] = {
                title: todoTitle[index],
                steps: [],
              };
            }
            newAllToDo[step.stepDate][todoIds[index]].steps.push({
              id: step.stepId,
              name: step.description,
              done: step.isCompleted,
            });
          });
        });
        set(state => ({
          ...state,
          allToDo: newAllToDo,
          curToDo: newAllToDo[dateToFormatString(state.curDate)],
        }));
      },
      handleModifyStep: (goalId, stepId, description) => {
        modifyStep(stepId, description)
          .then(() => {
            set(state => {
              const dateString = dateToFormatString(state.curDate);

              // 1. `map`을 사용해 새로운 steps 배열 생성
              const newSteps = state.allToDo[dateString][goalId].steps.map(step =>
                step.id === stepId && typeof description === "string"
                  ? { ...step, name: description } // 조건이 맞으면 새로운 객체 반환
                  : step,
              );

              // 2. 새로운 allToDo 객체 생성 (계층적으로 복사)
              const newAllToDo = {
                ...state.allToDo,
                [dateString]: {
                  ...state.allToDo[dateString],
                  [goalId]: {
                    ...state.allToDo[dateString][goalId],
                    steps: newSteps, // 새로 만든 steps 배열로 교체
                  },
                },
              };

              // 3. 새로운 curToDo 생성
              const newCurToDo = newAllToDo[dateString];

              // 4. 새로운 상태 반환
              return {
                ...state,
                allToDo: newAllToDo,
                curToDo: newCurToDo,
              };
            });
          })
          .catch(() =>
            set(state => ({
              ...state,
            })),
          );
      },
      handleDeleteStep: (goalId, stepId) => {
        deleteStep(stepId)
          .then(() => {
            set(state => {
              const dateString = dateToFormatString(state.curDate);
              const currentGoal = state.allToDo[dateString]?.[goalId];

              if (!currentGoal) {
                return state;
              }

              const newSteps = currentGoal.steps.filter(step => step.id !== stepId);

              let newAllToDo;
              if (newSteps.length === 0) {
                // Optimistic UI: UI를 먼저 업데이트하고 API 호출

                const newGoalsForDate = { ...state.allToDo[dateString] };
                delete newGoalsForDate[goalId];

                newAllToDo = {
                  ...state.allToDo,
                  [dateString]: newGoalsForDate,
                };

                fetchSteps(goalId)
                  .then(response => {
                    if (
                      response &&
                      typeof response === "object" &&
                      "steps" in response &&
                      response.steps.length === 0
                    ) {
                      deleteTodo(goalId).catch(error => {
                        console.error("Failed to delete todo:", error);
                      });
                    }
                  })
                  .catch(error => console.error(error));
              } else {
                newAllToDo = {
                  ...state.allToDo,
                  [dateString]: {
                    ...state.allToDo[dateString],
                    [goalId]: {
                      ...currentGoal,
                      steps: newSteps,
                    },
                  },
                };
              }

              const newCurToDo = newAllToDo[dateString] || {};
              return { ...state, allToDo: newAllToDo, curToDo: newCurToDo };
            });
          })
          .catch(error => {
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
