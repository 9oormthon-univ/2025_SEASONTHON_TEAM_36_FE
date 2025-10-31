import { Dispatch, SetStateAction } from "react";

import { CustomStepType, HandleStep, StepType } from "./ToDo";

export interface ModifyDeleteProps {
  handleModifyStep: HandleStep;
  handleDeleteStep: HandleStep;
}

export interface StepManagerProps {
  isModify: boolean;
  setIsModify: Dispatch<SetStateAction<boolean>>;
  handleDeleteStep: () => void;
  isShowing: boolean;
  setIsShowing: () => void;
  cancelModify: () => void;
}

export interface StepProps {
  goalId: number;
  step: CustomStepType;
}

export interface GoalProps {
  goalId: number;
  goal: string;
  steps: CustomStepType[];
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

// export interface FormProps {
//   toggle: boolean;
//   setToggle: React.Dispatch<React.SetStateAction<boolean>>;
//   formContents: [string, string, string | null, string | null, boolean[]];
//   setFormContents: React.Dispatch<
//     React.SetStateAction<[string, string, string | null, string | null, boolean[]]>
//   >;
//   handleSubmit: () => void;
// }

// export interface FormModalProps {
//   open: boolean;
//   handleAllToDo: () => void;
//   handleShowModal: () => void;
// }

// export interface FormFieldProps {
//   title?: string;
//   fontSize?: string;
//   children: React.ReactNode;
// }

export interface GoalDeadlineProps {
  steps: StepType[];
  setStatus: React.Dispatch<React.SetStateAction<number>>;
  setFormContents: React.Dispatch<
    React.SetStateAction<[string, string, string | null, string | null, boolean[]]>
  >;
  setStepsOfNewGoal: React.Dispatch<React.SetStateAction<StepType[]>>;
  handleAllToDo: () => void;
  handleShowModal: () => void;
}

// export interface WeekButtonsProps {
//   checkDays: boolean[];
//   handleDays: (index: number) => void;
// }
