import { useCallback, useRef, useState } from "react";

import DeleteImg from "../../../assets/images/delete.png";
import ModifyImg from "../../../assets/images/modify.png";
import MoreImg from "../../../assets/images/more.png";
import {
  Divider,
  MoreButton,
  StepManagerOption,
  StepManagerOptions,
  StepManagerStyle,
} from "../styles/Step";
import { StepManagerProps } from "../types/props";

const StepManager = ({
  isModify,
  setIsModify,
  handleModifyStep,
  handleDeleteStep,
}: StepManagerProps) => {
  const managerRef = useRef(null);
  const [isShowing, setIsShowing] = useState(false);
  const handleShowManager = useCallback(() => {
    setIsShowing(prev => !prev);
  }, []);

  return (
    <StepManagerStyle>
      <MoreButton
        onClick={() => {
          if (isModify) {
            handleModifyStep();
            setIsModify();
          } else handleShowManager();
        }}
      >
        <img src={MoreImg} alt="더보기" width="24" height="24" />
      </MoreButton>
      <StepManagerOptions ref={managerRef} $isShowing={isShowing}>
        <StepManagerOption
          onClick={() => {
            setIsModify();
            handleShowManager();
          }}
        >
          <span>수정하기</span>
          <img src={ModifyImg} alt="수정" width="18" height="18" />
        </StepManagerOption>
        <Divider />
        <StepManagerOption onClick={handleDeleteStep}>
          <span>삭제하기</span>
          <img src={DeleteImg} alt="삭제" width="18" height="18" />
        </StepManagerOption>
      </StepManagerOptions>
    </StepManagerStyle>
  );
};

export default StepManager;
