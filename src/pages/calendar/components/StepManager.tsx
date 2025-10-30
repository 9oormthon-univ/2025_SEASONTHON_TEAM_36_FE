import { useRef } from "react";

import CloseImg from "@/assets/images/close.png";
import Delete from "@/assets/images/delete.png";
import Modify from "@/assets/images/modify.png";
import MoreImg from "@/assets/images/more.png";

import {
  DeleteImg,
  Divider,
  ModifyImg,
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
  isShowing,
  setIsShowing,
  cancelModify,
}: StepManagerProps) => {
  const stepManagerRef = useRef<HTMLDivElement>(null);

  return (
    <StepManagerStyle ref={stepManagerRef} data-step-manager>
      {isShowing && (
        <StepManagerOptions $isShowing={isShowing}>
          <StepManagerOption
            onClick={() => {
              if (isModify) {
                handleModifyStep();
                setIsShowing();
              }
              setIsModify(prev => !prev);
            }}
          >
            <span>{isModify ? "확인" : "수정하기"}</span>
            {!isModify && <ModifyImg src={Modify as string} alt="수정" />}
          </StepManagerOption>
          <Divider />
          <StepManagerOption
            onClick={() => {
              if (!isModify) {
                handleDeleteStep();
                setIsShowing();
              } else {
                cancelModify();
              }
            }}
          >
            <span>{isModify ? "취소" : "삭제하기"}</span>
            {!isModify && <DeleteImg src={Delete as string} alt="삭제" />}
          </StepManagerOption>
        </StepManagerOptions>
      )}
      <MoreButton
        onClick={() => {
          setIsShowing();
          setIsModify(false);
          if (isModify) cancelModify();
        }}
      >
        <img
          src={isShowing ? (CloseImg as string) : (MoreImg as string)}
          alt="더보기"
          width="24"
          height="24"
        />
      </MoreButton>
    </StepManagerStyle>
  );
};

export default StepManager;
