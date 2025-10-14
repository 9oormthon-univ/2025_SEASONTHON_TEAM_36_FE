/**
 * End-Point: [PUT] /api/v1/todos/{todoId}
 * ToDo 목표 재설정
 * src/apis/todo.ts의 updateToDo와 대응
 */

type TodoStep = {
  stepDate: string;
  description: string;
};

export interface ReqUpdateTodo {
  title: string;
  content: string;
  addDays: number;
  todoSteps: Array<TodoStep>;
}

/**
 * End-Point: [POST] /api/v1/todos
 * ToDo 추가
 * src/apis/todo.ts의 addToDo와 대응
 */

type Days = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ReqAddTodo {
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  expectedDays: Array<Days>;
}
