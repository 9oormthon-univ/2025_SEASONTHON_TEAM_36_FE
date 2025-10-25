import { useEffect } from "react";

import { fetchSteps } from "@/apis/step";
import { fetchTodos } from "@/apis/todo";
import { ErrorResponse } from "@/common/types/error";
import { RespStepInfo } from "@/common/types/response/step";
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
          Promise.all(response.contents.map((value: RespTodo) => fetchSteps(value.id)))
            .then(response => {
              const todos = response.map(value => {
                if (typeof value === "object" && value !== null && "steps" in value) {
                  return value.steps;
                }
                return [] as RespStepInfo[];
              });
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
