import { Goal, HandleStep, NewStep, StepType } from "./ToDo";

export interface ModifyDeleteProps {
  handleModifyStep: HandleStep;
  handleDeleteStep: HandleStep;
}

export interface StepManagerProps {
  isModify: boolean;
  setIsModify: () => void;
  handleModifyStep: () => void;
  handleDeleteStep: () => void;
}

export interface StepProps {
  goalId: number;
  step: StepType;
}

export interface GoalProps {
  goalId: number;
  goal: string;
  steps: StepType[];
}

export interface CustomCalendarProps {
  curDate: Date;
  handleToDo: (selectedDate: string | Date) => void;
  handleMoveMonth: (move: number) => void;
}

export interface CustomDatePickerProps {
  index: number;
  onChange: (index: number, newValue: string | boolean[]) => void;
}

export interface FormProps {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  formContents: [string, string, string | null, string | null, boolean[]];
  setFormContents: React.Dispatch<
    React.SetStateAction<[string, string, string | null, string | null, boolean[]]>
  >;
  handleSubmit: () => void;
}

export interface FormModalProps {
  open: boolean;
  handleAllToDo: () => void;
  handleShowModal: () => void;
}

export interface FormFieldProps {
  title?: string;
  fontSize?: string;
  children: React.ReactNode;
}

export interface GoalDeadlineProps {
  steps: NewStep[];
  setStatus: React.Dispatch<React.SetStateAction<number>>;
  setFormContents: React.Dispatch<
    React.SetStateAction<[string, string, string | null, string | null, boolean[]]>
  >;
  setStepsOfNewGoal: React.Dispatch<React.SetStateAction<NewStep[]>>;
  handleAllToDo: () => void;
  handleShowModal: () => void;
}

export interface WeekButtonsProps {
  checkDays: boolean[];
  handleDays: (index: number) => void;
}
