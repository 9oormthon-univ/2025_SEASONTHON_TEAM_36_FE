type DateString = string;
type GoalId = number;

export interface HandleStep {
  (goalId: number, stepId: number, description?: string): void;
}

export interface CustomStepType {
  name: string;
  id: number;
  done: boolean;
}

export interface StepType {
  stepId: number;
  stepDate: string;
  description: string;
  isCompleted: number;
}

export interface GoalInfo {
  title: string;
  steps: CustomStepType[];
}

export type Goal = Record<GoalId, GoalInfo>;

export type Goals = Record<DateString, Goal>;
