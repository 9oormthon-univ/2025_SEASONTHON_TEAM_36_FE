type DateString = string;
type GoalId = number;

export interface HandleStep {
  (goalId: number, stepId: number, description?: string): void;
}

export interface StepType {
  name: string;
  id: number;
  done: boolean;
}

// 실제 사용되는 Step의 구조를 정의
export interface NewStep {
  stepId: number;
  stepDate: string;
  description: string;
  todoId?: number;
}

export interface GoalInfo {
  name: string;
  steps: StepType[];
}

export type Goal = Record<GoalId, GoalInfo>;

export type Goals = Record<DateString, Goal>;
