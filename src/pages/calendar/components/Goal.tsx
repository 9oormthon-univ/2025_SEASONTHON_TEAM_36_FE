import { StepContent } from "@mui/material";
import { useEffect, useState } from "react";

import DotImg from "../../../assets/images/dot.png";
import { Input } from "../styles";
import { GoalContainer, GoalName, GoalStyle } from "../styles/Goal";
import { Row, StepCheckBox, StepList } from "../styles/Step";
import { GoalProps } from "../types/props";
import type { Step } from "../types/ToDo";
import StepManager from "./StepManager";

const GoalDivider = () => {
  return <img src={DotImg} alt="Goal 강조점" width="6" height="6" style={{ marginRight: "6px" }} />;
};

const Goal = ({ goalId, goal, steps, handleModifyStep, handleDeleteStep }: GoalProps) => {
  const [updateSteps, setUpdateSteps] = useState<Step[]>([]);
  const [isModify, setIsModify] = useState<boolean[]>(steps.map(_ => false));

  useEffect(() => {
    setUpdateSteps(steps);
  }, [steps]);

  return (
    <GoalStyle>
      <GoalContainer>
        <GoalDivider />
        <GoalName>{goal}</GoalName>
      </GoalContainer>
      <StepList>
        {steps.map((step, index: number) => {
          return (
            <Row key={step.id}>
              <StepContent>
                <StepCheckBox $did={step.done} />
                <Input
                  type="text"
                  value={updateSteps[index]?.name ?? ""}
                  disabled={!isModify[index]}
                  onChange={e => {
                    const tmpSteps = [...updateSteps];
                    tmpSteps[index].name = e.target.value;
                    setUpdateSteps(tmpSteps);
                  }}
                  $fontSize={"var(--fs-md)"}
                />
              </StepContent>
              <StepManager
                isModify={isModify[index]}
                setIsModify={() => {
                  const tmp = [...isModify];
                  tmp[index] = !tmp[index];
                  setIsModify(tmp);
                }}
                handleModifyStep={() => {
                  handleModifyStep(goalId, step.id, updateSteps[index].name);
                }}
                handleDeleteStep={() => {
                  handleDeleteStep(goalId, step.id);
                }}
              />
            </Row>
          );
        })}
      </StepList>
    </GoalStyle>
  );
};

export default Goal;
