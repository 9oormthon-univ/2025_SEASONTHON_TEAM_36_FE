/**
 * End-Point: [PUT] /api/v1/todos/{todoId}
 * Step 수정
 * src/apis/todo.ts의 updateTodo
 *
 * End-Point: [PUT] /api/v1/todos/{todoId}/complete
 * Todo 완료
 * src/apis/todo.ts의 updateTodoComplete
 *
 * End-Point: [POST] /api/v1/todos
 * Todo 추가
 * src/apis/todo.ts의 addTodo
 */

export type TodoType =
  | "PREVIEW_REVIEW"
  | "HOMEWORK"
  | "TEST_STUDY"
  | "PERFORMANCE_ASSESSMENT"
  | "CAREER_ACTIVITY"
  | "ETC";
export interface RespTodo {
  currentDate: string;
  id: number;
  userId: number;
  dDay: string;
  title: string;
  warmMessage: string;
  progress: number;
  isCompleted: boolean;
  todoType: TodoType;
}

/**
 * End-Point: [GET] /api/v1/todos
 * 회원의 Todo 조회
 * src/apis/todo.ts의 fetchTodos
 */

export interface RespAllTodo {
  pages: number;
  total: number;
  contents: Array<RespTodo>;
}
