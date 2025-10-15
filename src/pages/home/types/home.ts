// pages/home/types/home.ts

// styled-components transient props
export interface BodyStyledProps {
  $sheetHeight: number; // px
  $shrink: number; // 0~1
}

// API 응답을 홈에서 부를 때 명확히 이름 부여
export type ApiTodosResponse = import("@/common/types/response/todo").RespAllTodo;

// 카드/시트에서 주로 쓰는 필드만 별칭으로 노출(원형은 RespTodo)
export type HomeGoal = import("@/common/types/response/todo").RespTodo;

// Goal 식별자(원형이 number이므로 number 유지)
export type GoalId = HomeGoal["id"];
