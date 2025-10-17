import DotImg from "../../../assets/images/dot.png";
import { GoalContainer, GoalName, GoalStyle } from "../styles/Goal";
import { StepList } from "../styles/Step";
import type { GoalProps } from "../types/props";
import type { StepType } from "../types/ToDo";
import Step from "./Step";

const GoalDivider = () => {
  return <img src={DotImg} alt="Goal 강조점" width="6" height="6" style={{ marginRight: "6px" }} />;
};

const Goal = ({ goalId, goal, steps }: GoalProps) => {
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalDivider />
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
