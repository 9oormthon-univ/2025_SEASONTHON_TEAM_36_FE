import DotImg from "../../../assets/images/dot.png";
import { GoalContainer, GoalName, GoalStyle } from "../styles/Goal";
import { StepList } from "../styles/Step";
import type { GoalProps } from "../types/props";
import type { StepType } from "../types/ToDo";
import Step from "./Step";

const Goal = ({ goalId, goal, steps }: GoalProps) => {
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalName>{goal}</GoalName>
      </GoalContainer>
      <StepList>
        {steps.map((step: StepType, index: number) => (
          <Step key={index} goalId={goalId} step={step} />
        ))}
      </StepList>
    </GoalStyle>
  );
};

export default Goal;
