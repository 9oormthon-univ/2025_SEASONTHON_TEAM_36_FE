import { GoalContainer, GoalName, GoalStyle } from "../styles/Goal";
import { StepList } from "../styles/Step";
import type { GoalProps } from "../types/props";
import type { CustomStepType } from "../types/ToDo";
import Step from "./Step";

const Goal = ({ goalId, goal, steps }: GoalProps) => {
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalName>{goal}</GoalName>
      </GoalContainer>
      <StepList>
        {steps.map((step: CustomStepType, index: number) => (
          <Step key={index} goalId={goalId} step={step} />
        ))}
      </StepList>
    </GoalStyle>
  );
};

export default Goal;
