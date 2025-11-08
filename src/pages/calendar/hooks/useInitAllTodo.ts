import { useEffect } from "react";

import { fetchSteps } from "@/apis/step";
import { fetchTodos } from "@/apis/todo";
import { ErrorResponse } from "@/common/types/error";
import { RespStepItem } from "@/common/types/response/step";
import { RespAllTodo, RespTodo } from "@/common/types/response/todo";

import { useCalendar } from "../stores/useCalendar";

export const useInitAllTodo = () => {
  const initAllTodo = useCalendar(state => state.initAllTodo);
  useEffect(() => {
    fetchTodos()
      .then((response: RespAllTodo | string | ErrorResponse) => {
        // 객체이고 contents 속성이 있는지 확인
        if (typeof response === "object" && response !== null && "contents" in response) {
          const todoIds = response.contents.map(value => value.id);
          const todoTitle = response.contents.map(value => value.title);
          Promise.allSettled(response.contents.map((value: RespTodo) => fetchSteps(value.id)))
            .then(response => {
              const todos = response.map(
                (todo: PromiseSettledResult<string | RespTodoSteps | ErrorResponse>) => {
                  // fulfilled 상태인지 확인
                  if (todo.status === "fulfilled") {
                    const value = todo.value;
                    if (
                      typeof value === "object" &&
                      value !== null &&
                      "steps" in value &&
                      Array.isArray(value.steps)
                    ) {
                      return value.steps;
                    }
                  }
                  // rejected 상태이거나 steps가 없는 경우 빈 배열 반환
                  return [] as RespStepInfo[];
                },
              );
              initAllTodo(todoIds, todoTitle, todos);
            })
            .catch(error => console.error(error));
        }
      })
      .catch(error => {
        console.error(error);
        return {};
      });
  }, [initAllTodo]);
};
