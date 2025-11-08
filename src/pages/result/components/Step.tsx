import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { modifyStep } from "@/apis/step";
import ModifyImg from "@/assets/images/modify-result.svg";
import { RespStepInfo } from "@/common/types/response/step";
import { useOnClickOutside } from "@/pages/calendar/hooks/useOnClickOutside";

import { Textarea } from "../styles";

const Step = ({ stepData }: { stepData: RespStepInfo }) => {
  const [isModify, setIsModify] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(stepData?.description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // 높이 조정 함수
  const adjustHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // useLayoutEffect를 사용하여 렌더링 직후 높이를 계산하고 적용
  useLayoutEffect(() => {
    adjustHeight(textareaRef.current);
  }, [description, isModify]);

  // 외부 클릭 시 수정 완료
  useOnClickOutside(stepRef, () => {
    if (isModify) {
      setIsModify(false);
      modifyStep(stepData.stepId, description)
        .then(_ => {})
        .catch(error => console.error(error));
    }
  });

  // 수정 모드 토글
  const handleModifyClick = () => {
    if (!isModify) {
      setIsModify(true);
      // 수정 모드 진입 시 포커스
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setTimeout(() => adjustHeight(e.target), 0);
  };

  return (
    <StepContainer ref={stepRef}>
      <StepDate>{stepData.stepDate}</StepDate>
      <StepContent>
        <Textarea
          ref={textareaRef}
          $isModify={isModify}
          value={description}
          onChange={handleTextChange}
          disabled={!isModify}
          rows={1}
          onInput={e => adjustHeight(e.target as HTMLTextAreaElement)}
        />
        <Modify onClick={handleModifyClick}>
          <img src={ModifyImg} alt="수정" width="16" height="16" />
        </Modify>
      </StepContent>
    </StepContainer>
  );
};

const StepContainer = styled.div`
  display: flex;
  width: 100%;
  padding: clamp(6px, 1.93vw, 8px) clamp(8px, 2.42vw, 10px);
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1px, 0.48vw, 2px);
  border-radius: clamp(12px, 3.86vw, 16px);
  background: var(--natural-color-natural-0, #fff);

  /* shadow */
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-color-natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-color-natural-400, #d6d9e0);
`;

const StepDate = styled.div`
  color: var(--Text-Text-2, #6f737b);
  padding: 0 clamp(12px, 3.62vw, 15px);
  font-family: var(--Font-Family-Font-Family, Pretendard);
  font-size: clamp(11px, 3.14vw, 13px);
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  letter-spacing: var(--Letter-spacing-Letter-spacing-2, 0);
`;

const StepContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(8px, 2.42vw, 10px);
`;

const Modify = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: clamp(3px, 0.97vw, 4px);

  img {
    width: clamp(14px, 3.86vw, 16px);
    height: clamp(14px, 3.86vw, 16px);
  }
`;

export default Step;
