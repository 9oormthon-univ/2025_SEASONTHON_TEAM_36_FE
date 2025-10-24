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

export interface RespTodo {
  currentDate: string;
  id: number;
  userId: number;
  dDay: string;
  title: string;
  warmMessage: string;
  progress: number;
  isCompleted: boolean;
  // stepResponses: Array<RespStepInfo>; 25.10.23 수정사항 반영
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
