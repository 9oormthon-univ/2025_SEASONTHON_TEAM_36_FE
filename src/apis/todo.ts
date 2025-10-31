// src/apis/todo.js
import { ReqAddTodo, ReqUpdateTodo } from "@/common/types/request/todo";
import { RespAllTodo, RespTodo } from "@/common/types/response/todo";

import { handleApiRequest } from "./apiUtils";
import mainApi from "./index";

const BASE = "/api/v1/todos";

/** [GET] 회원의 ToDo 조회 */
export async function fetchTodos() {
  return handleApiRequest<RespAllTodo>(() =>
    mainApi.get(BASE, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] ToDo 추가 */
export async function addTodo(payload: ReqAddTodo, options: { signal?: AbortSignal } = {}) {
  return handleApiRequest<RespTodo>(() =>
    mainApi.post(BASE, payload, {
      headers: { "Content-Type": "application/json" },
      signal: options.signal,
    }),
  );
}

/** [DELETE] ToDo 삭제 */
export async function deleteTodo(todoId: number) {
  if (todoId == null) throw new Error("todoId is required");
  return handleApiRequest<object>(() =>
    mainApi.delete(`${BASE}/${todoId}`, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [PUT] ToDo 목표 재설정 */
export async function updateTodo(
  todoId: number,
  payload: ReqUpdateTodo,
  options: { signal?: AbortSignal } = {},
) {
  if (todoId == null) throw new Error("todoId is required");
  return handleApiRequest<RespTodo>(() =>
    mainApi.put(`${BASE}/${todoId}`, payload, {
      headers: { "Content-Type": "application/json" },
      signal: options.signal,
    }),
  );
}

export async function updateCompleteToDo(todoId: number) {
  return handleApiRequest<RespTodo>(() =>
    mainApi.put(`${BASE}/${todoId}/complete`, {
      headers: { "Content-Type": "application/json" },
    }),
  );
}

export default {
  fetchTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  updateCompleteToDo,
};
