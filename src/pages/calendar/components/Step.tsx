import { useEffect, useState } from "react";

import { useCalendar } from "../stores/useCalendar";
import { Input } from "../styles";
import { Row, StepCheckBox, StepContent } from "../styles/Step";
import type { StepProps } from "../types/props";
import type { CustomStepType } from "../types/ToDo";
import StepManager from "./StepManager";

const Step = ({ goalId, step }: StepProps) => {
  const [updatedStep, setUpdatedStep] = useState<CustomStepType>(step);
  const [isModify, setIsModify] = useState<boolean>(false);
  const handleModifyStep = useCalendar(state => state.handleModifyStep);
  const handleDeleteStep = useCalendar(state => state.handleDeleteStep);

  useEffect(() => {
    setUpdatedStep(step);
  }, [step]);

  return (
    <Row key={step.id}>
      <StepContent>
        <StepCheckBox $did={step.done} />
        <Input
          type="text"
          value={updatedStep?.name ?? ""}
          disabled={!isModify}
          onChange={e => {
            // 기존 상태를 복사하여 새 객체 생성 (불변성 유지)
            setUpdatedStep({
              ...updatedStep,
              name: e.target.value,
            });
          }}
          $fontSize={"var(--fs-md)"}
        />
      </StepContent>
      <StepManager
        isModify={isModify}
        setIsModify={() => setIsModify(!isModify)}
        handleModifyStep={() => {
          handleModifyStep(goalId, step.id, updatedStep.name);
        }}
        handleDeleteStep={() => {
          handleDeleteStep(goalId, step.id);
        }}
      />
    </Row>
  );
};

export default Step;
