import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useOnClickOutside } from "@/pages/calendar/hooks/useOnClickOutside";

import { useCalendar } from "../stores/useCalendar";
import { Textarea } from "../styles";
import { Row, StepCheckBox, StepContent } from "../styles/Step";
import type { StepProps } from "../types/props";
import type { CustomStepType } from "../types/ToDo";
import StepManager from "./StepManager";

const Step = ({ goalId, step }: StepProps) => {
  const [updatedStep, setUpdatedStep] = useState<CustomStepType>(step);
  const [isModify, setIsModify] = useState<boolean>(false);
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const handleModifyStep = useCalendar(state => state.handleModifyStep);
  const handleDeleteStep = useCalendar(state => state.handleDeleteStep);
  const cancelModify = useCallback(() => {
    setUpdatedStep({
      ...step,
    });
    setIsModify(false); // 수정 취소 시 isModify 상태도 false로 변경
  }, [step]);

  useOnClickOutside(stepRef, () => {
    if (isModify) {
      handleModifyStep(goalId, step.id, updatedStep.name);
      setIsModify(false);
    }
    if (isShowing) {
      setIsShowing(prev => !prev);
    }
  });

  useEffect(() => {
    if (isModify && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [isModify]);

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
  }, [step, isShowing, updatedStep?.name]); // 내용이 변경될 때마다 높이 재조정

  return (
    <div ref={stepRef}>
      <Row key={step.id}>
        <StepContent>
          <StepCheckBox $did={step.done} />
          <Textarea
            name="step"
            ref={ref}
            value={updatedStep?.name}
            disabled={!isModify}
            $isModify={isModify}
            onChange={e => {
              setUpdatedStep({
                ...updatedStep,
                name: e.target.value,
              });
            }}
            $fontSize={"var(--fs-md)"}
            rows={1} // rows를 1로 설정하여 초기 높이를 최소화
          />
          <StepManager
            isModify={isModify}
            setIsModify={setIsModify}
            handleDeleteStep={() => {
              handleDeleteStep(goalId, step.id);
            }}
            isShowing={isShowing}
            setIsShowing={() => {
              setIsShowing(prev => !prev);
            }}
            cancelModify={cancelModify}
          />
        </StepContent>
      </Row>
    </div>
  );
};

export default Step;
