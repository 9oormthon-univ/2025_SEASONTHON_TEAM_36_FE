import { useCallback, useRef } from "react";

import CloseImg from "@/assets/images/close.png";
import DeleteImg from "@/assets/images/delete.png";
import ModifyImg from "@/assets/images/modify.png";
import MoreImg from "@/assets/images/more.png";

import {
  MoreButton,
  StepManagerOption,
  StepManagerOptions,
  StepManagerStyle,
} from "../styles/Step";
import type { StepManagerProps } from "../types/props";

const StepManager = ({
  isModify,
  setIsModify,
  handleModifyStep,
  handleDeleteStep,
  detail,
  handleShowingStepDetail,
  cancelModify,
}: StepManagerProps) => {
  const stepManagerRef = useRef<HTMLDivElement>(null);

  const handleShowManager = useCallback(() => {
    handleShowingStepDetail();
  }, [handleShowingStepDetail]);

  return (
    <StepManagerStyle ref={stepManagerRef} data-step-manager>
      {detail && (
        <StepManagerOptions $isShowing={detail}>
          <StepManagerOption
            onClick={() => {
              if (isModify) {
                handleModifyStep();
                handleShowManager();
              }
              setIsModify(prev => !prev);
            }}
          >
            <span>{isModify ? "확인" : "수정"}</span>
            {!isModify && <img src={ModifyImg as string} alt="수정" width="18" height="18" />}
          </StepManagerOption>
          <StepManagerOption
            onClick={() => {
              if (!isModify) {
                handleDeleteStep();
              }
              if (isModify) cancelModify();
              setIsModify(false);
              handleShowManager();
            }}
          >
            <span>{isModify ? "취소" : "삭제"}</span>
            {!isModify && <img src={DeleteImg as string} alt="삭제" width="18" height="18" />}
          </StepManagerOption>
        </StepManagerOptions>
      )}

      <MoreButton
        onClick={() => {
          handleShowManager();
          setIsModify(false);
          if (isModify) cancelModify();
        }}
      >
        <img
          src={detail ? (CloseImg as string) : (MoreImg as string)}
          alt="더보기"
          width="24"
          height="24"
        />
      </MoreButton>
    </StepManagerStyle>
  );
};

export default StepManager;
