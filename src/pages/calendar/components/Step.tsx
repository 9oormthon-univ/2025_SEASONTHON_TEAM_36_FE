import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useCalendar } from "../stores/useCalendar";
import { Input, Textarea } from "../styles";
import { Row, StepCheckBox, StepContent } from "../styles/Step";
import type { StepProps } from "../types/props";
import type { CustomStepType } from "../types/ToDo";
import StepManager from "./StepManager";

const Step = ({ goalId, step, detail, handleShowingStepDetail }: StepProps) => {
  const [updatedStep, setUpdatedStep] = useState<CustomStepType>(step);
  const [isModify, setIsModify] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleModifyStep = useCalendar(state => state.handleModifyStep);
  const handleDeleteStep = useCalendar(state => state.handleDeleteStep);
  const cancelModify = useCallback(() => {
    setUpdatedStep({
      ...step,
    });
    setIsModify(false); // 수정 취소 시 isModify 상태도 false로 변경
  }, [step]);

  useEffect(() => {
    setUpdatedStep(step);
  }, [step]);

  // 높이 조정 함수
  const adjustHeight = () => {
    if (ref.current) {
      ref.current.style.height = "auto"; // 높이를 초기화
      ref.current.style.height = `${ref.current.scrollHeight}px`; // scrollHeight로 높이 설정
    }
  };

  // useLayoutEffect를 사용하여 렌더링 직후 높이를 계산하고 적용 (깜빡임 방지)
  useLayoutEffect(() => {
    adjustHeight();
  }, [step, detail, updatedStep?.name]); // 내용이 변경될 때마다 높이 재조정

  return (
    <Row key={step.id} $detail={detail}>
      <StepContent>
        <StepCheckBox $did={step.done} />
        {!detail && (
          <Input
            type="text"
            value={updatedStep?.name ?? ""}
            disabled={true}
            $fontSize={"var(--fs-md)"}
          />
        )}
        <StepManager
          isModify={isModify}
          setIsModify={setIsModify}
          handleModifyStep={() => {
            handleModifyStep(goalId, step.id, updatedStep.name);
          }}
          handleDeleteStep={() => {
            handleDeleteStep(goalId, step.id);
          }}
          detail={detail}
          handleShowingStepDetail={handleShowingStepDetail}
          cancelModify={cancelModify}
        />
      </StepContent>
      {detail && (
        <Textarea
          id="text"
          ref={ref}
          value={updatedStep?.name}
          disabled={!isModify}
          onChange={e => {
            setUpdatedStep({
              ...updatedStep,
              name: e.target.value,
            });
          }}
          $fontSize={"var(--fs-md)"}
          rows={1} // rows를 1로 설정하여 초기 높이를 최소화
        />
      )}
    </Row>
  );
};

export default Step;
