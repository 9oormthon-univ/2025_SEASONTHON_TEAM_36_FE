// src/apis/todo.js
import mainApi from './index';

const BASE = '/api/v1/todos';

/** [GET] 회원의 ToDo 조회 */
export async function fetchTodos() {
  const { data } = await mainApi.get(BASE, {
    headers: { Accept: 'application/json' },
  });
  return data; // { pages, total, contents }
}

/** [POST] ToDo 추가 */
export async function addTodo(payload, options = {}) {
  const { data } = await mainApi.post(BASE, payload, {
    headers: { 'Content-Type': 'application/json' },
    signal: options.signal,
  });
  return data;
}

/** [DELETE] ToDo 삭제 */
export async function deleteTodo(todoId) {
  if (todoId == null) throw new Error('todoId is required');
  const { data } = await mainApi.delete(`${BASE}/${todoId}`, {
    headers: { Accept: 'application/json' },
  });
  return data; 
}

/** [PUT] ToDo 목표 재설정 */
export async function updateTodo(todoId, payload, options = {}) {
  if (todoId == null) throw new Error('todoId is required');
  const { data } = await mainApi.put(`${BASE}/${todoId}`, payload, {
    headers: { 'Content-Type': 'application/json' },
    signal: options.signal,
  });
  return data; 
}

export default {
  fetchTodos,
  addTodo,
  deleteTodo,
  updateTodo,
};
