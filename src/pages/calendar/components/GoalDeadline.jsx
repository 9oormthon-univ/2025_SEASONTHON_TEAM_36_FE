import { useState } from "react";
import styled from "styled-components";

import { modifyStep } from "../../../apis/step";
import ModifyImg from "../../../assets/images/modify.png";
import GreenButton from "../../../common/components/GreenButton";
import Input from "./Input";
import Title from "./Title";

const GoalDeadlineStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 56px 37px;
`;

const SizedBox = styled.div`
  height: ${props => props.$height}px;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: 353px;
  overflow: auto; /* 세로 스크롤 */
  padding: 5px; /* 그림자가 잘리지 않게 여백 */

  /* 스크롤바 커스터마이징 (옵션) */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  border-radius: 16px;
  padding: 10px 24px;
  box-shadow: 0.3px 0.3px 5px 0 var(--natural-400), -0.3px -0.3px 5px 0 var(--natural-400);
`;

const StepDate = styled.span`
  display: block;
  margin-top: 4px;
  margin-left: 5px;
  color: var(--text-2);
  font-size: var(--fs-sm);
`;

const StepContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const GoalDeadline = ({
  steps,
  setStatus,
  setFormContents,
  setStepsOfNewGoal,
  handleAllToDo,
  handleShowModal,
}) => {
  const [isModify, setIsModify] = useState(steps.map(_ => false));
  const [updateSteps, setUpdateSteps] = useState(steps.map(step => step));
  // 수정 버튼 클릭 → 편집 모드 토글
  return (
    <GoalDeadlineStyle>
      <div style={{ width: "100%" }}>
        <Title fontSize={"var(--fs-2xl)"}>Goal</Title>
      </div>
      <SizedBox $height={30} />
      <div style={{ width: "100%" }}>
        <Title>목표 마감일</Title>
      </div>
      <SizedBox $height={30} />

      <StepList>
        {steps?.map((step, index) => (
          <Step key={index}>
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
                    modifyStep(updateSteps[index].stepId, updateSteps[index].description).then(
                      resp => resp,
                    );
                  }
                  const tmpIsModify = [...isModify];
                  tmpIsModify[index] = !tmpIsModify[index];
                  setIsModify(tmpIsModify);
                }}
              >
                <img src={ModifyImg} alt="수정하기" width="16" height="16" />
              </button>
            </StepContent>
          </Step>
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
