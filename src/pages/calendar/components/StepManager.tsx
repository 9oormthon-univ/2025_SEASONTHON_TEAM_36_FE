import { useCallback, useEffect, useRef, useState } from "react";

import DeleteImg from "@/assets/images/delete.png";
import ModifyImg from "@/assets/images/modify.png";
import MoreImg from "@/assets/images/more.png";

import {
  Divider,
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
}: StepManagerProps) => {
  const [isShowing, setIsShowing] = useState(false);
  const stepManagerRef = useRef<HTMLDivElement>(null);

  const handleShowManager = useCallback(() => {
    setIsShowing(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // 현재 StepManager 외부를 클릭한 경우
      if (stepManagerRef.current && !stepManagerRef.current.contains(target)) {
        setIsShowing(false);
      }
    };

    if (isShowing) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isShowing]);

  return (
    <StepManagerStyle ref={stepManagerRef} data-step-manager>
      <MoreButton
        onClick={() => {
          handleShowManager();
        }}
      >
        <img src={MoreImg as string} alt="더보기" width="24" height="24" />
      </MoreButton>
      <StepManagerOptions $isShowing={isShowing}>
        <StepManagerOption
          onClick={() => {
            if (isModify) {
              handleModifyStep();
              handleShowManager();
            }
            setIsModify();
          }}
        >
          <span>수정하기</span>
          <img src={ModifyImg as string} alt="수정" width="18" height="18" />
        </StepManagerOption>
        <Divider />
        <StepManagerOption
          onClick={() => {
            handleDeleteStep();
            handleShowManager();
          }}
        >
          <span>삭제하기</span>
          <img src={DeleteImg as string} alt="삭제" width="18" height="18" />
        </StepManagerOption>
      </StepManagerOptions>
    </StepManagerStyle>
  );
};

export default StepManager;
