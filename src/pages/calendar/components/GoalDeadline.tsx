import { useState } from "react";

import { modifyStep } from "../../../apis/step";
import ModifyImg from "../../../assets/images/modify.png";
import GreenButton from "../../../common/components/GreenButton";
import { Input, Title } from "../styles";
import {
  GoalDeadlineStyle,
  SizedBox,
  StepContent,
  StepDate,
  StepList,
  StepStyle,
} from "../styles/Goal";
import { GoalDeadlineProps } from "../types/props";
import { NewStep } from "../types/ToDo";

const GoalDeadline = ({
  steps,
  setStatus,
  setFormContents,
  setStepsOfNewGoal,
  handleAllToDo,
  handleShowModal,
}: GoalDeadlineProps) => {
  const [isModify, setIsModify] = useState<boolean[]>(steps.map(_ => false));
  const [updateSteps, setUpdateSteps] = useState<NewStep[]>(steps);
  // 수정 버튼 클릭 → 편집 모드 토글
  return (
    <GoalDeadlineStyle>
      <Title $fontSize={"var(--fs-2xl)"}>Goal</Title>
      <SizedBox $height={30} />
      <Title $fontSize={"var(--fs-lg)"}>목표 마감일</Title>
      <SizedBox $height={30} />

      <StepList>
        {steps?.map((step, index: number) => (
          <StepStyle key={index}>
            <StepDate>{step.stepDate}</StepDate>
            <StepContent>
              <Input
                type="text"
                value={step.description}
                disabled={!isModify[index]}
                onChange={e => {
                  const tmpUpdateSteps = [...steps];
                  tmpUpdateSteps[index].description = e.target.value;
                  setUpdateSteps(tmpUpdateSteps);
                }}
                $fontSize={"var(--fs-lg)"}
                autoFocus={false}
              />
              <button
                style={{ marginLeft: "11.5px" }}
                onClick={() => {
                  if (isModify[index]) {
                    modifyStep(updateSteps[index].stepId, updateSteps[index].description)
                      .then((resp: any) => {
                        // 응답 처리 필요 시 여기에 로직 추가
                        return resp;
                      })
                      .catch((e: Error) => console.error(e));
                  }
                  const tmpIsModify = [...isModify];
                  tmpIsModify[index] = !tmpIsModify[index];
                  setIsModify(tmpIsModify);
                }}
              >
                <img src={ModifyImg} alt="수정하기" width="16" height="16" />
              </button>
            </StepContent>
          </StepStyle>
        ))}
      </StepList>

      <SizedBox $height={91} />
      <GreenButton
        onClick={() => {
          handleShowModal();
          handleAllToDo();
          setStepsOfNewGoal([]);
          setFormContents(["", "", "", "", [false, false, false, false, false, false, false]]);
          setStatus(0);
        }}
      >
        투두 적용하기
      </GreenButton>
    </GoalDeadlineStyle>
  );
};

export default GoalDeadline;
