import { useCallback, useState } from "react";

import { GoalContainer, GoalName, GoalStyle } from "../styles/Goal";
import { StepList } from "../styles/Step";
import type { GoalProps } from "../types/props";
import type { CustomStepType } from "../types/ToDo";
import Step from "./Step";

const Goal = ({ goalId, goal, steps }: GoalProps) => {
  const [stepDetail, setStepDetail] = useState<boolean[]>(steps.map(_ => false));
  const handleShowingStepDetail = useCallback(
    (index: number) => {
      const nextStepDetail = stepDetail.map((status, idx) => {
        if (idx != index) return false;
        return !stepDetail[index];
      });
      setStepDetail(nextStepDetail);
    },
    [stepDetail, setStepDetail],
  );
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalName>{goal}</GoalName>
      </GoalContainer>
      <StepList>
        {steps.map((step: CustomStepType, index: number) => (
          <Step
            key={index}
            goalId={goalId}
            step={step}
            detail={stepDetail[index]}
            handleShowingStepDetail={() => handleShowingStepDetail(index)}
          />
        ))}
      </StepList>
    </GoalStyle>
  );
};

export default Goal;
