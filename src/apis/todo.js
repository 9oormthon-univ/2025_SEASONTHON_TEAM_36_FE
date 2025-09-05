// src/apis/todo.js
import mainApi from "./index";

const BASE = "/api/v1/todos";

/** [GET] 회원의 ToDo 조회 */
export async function fetchTodos() {
  const { data } = await mainApi.get(BASE, {
    headers: { Accept: "application/json" },
  });
  return data; // { pages, total, contents }
}

/** [POST] ToDo 추가 */
export async function addTodo(payload) {
  const { data } = await mainApi.post(BASE, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

/** [DELETE] ToDo 삭제 */
export async function deleteTodo(todoId) {
  if (todoId == null) throw new Error("todoId is required");
  const { data } = await mainApi.delete(`${BASE}/${todoId}`, {
    headers: { Accept: "application/json" },
  });
  return data; // 서버가 반환하는 JSON이 있으면 그대로 반환
}

export default {
  fetchTodos,
  addTodo,
  deleteTodo,
};
