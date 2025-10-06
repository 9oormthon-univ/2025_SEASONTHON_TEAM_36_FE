import { useCallback, useState } from "react";
import styled from "styled-components";

import GreenButton from "../../../../common/components/GreenButton";
import TextInput from "../ModalTextInput";
import CustomDatePicker from "./CustomDatePicker";
import Header from "./Header";
import SubItem from "./Input";
import WeekButtons from "./WeekButtons";

const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 35px;
  margin-top: 14px;
  margin-bottom: 55px;
  padding: 0 30px;
`;

const GoalContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  resize: vertical;
  padding: 12px;

  border-radius: 4px;
  border: 0.5px solid var(--natural-400);
  background: var(--bg-1);
  resize: none;

  &::placeholder {
    color: var(--natural-800, #6f737b);
  }

  &:focus {
    outline: none;
  }
`;

const LetterCount = styled.div`
  display: flex;
  position: absolute;
  bottom: 24px;
  right: 15px;
`;

const Count = styled.span`
  color: var(--text-3);
  font-size: var(--fs-lg);
`;

const BottomLineContainer = styled.div`
  border-bottom: 1px solid var(--natural-400);
`;

const Submit = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
`;

const CheckBox = styled.div`
  width: 23px;
  height: 23px;
  border: ${props => (props.$toggle ? "none" : "1px solid var(--natural-400)")};
  border-radius: 4px;
  background-color: ${props => (props.$toggle ? "var(--green-500)" : "#ffffff")};
  transition:
    background-color 0.1s linear,
    border 0.1s linear;
`;

const EveryDay = styled.span`
  display: block;
  margin: 0 8px;
  font-size: var(--fs-xl);
`;

export default function Form({ toggle, setToggle, formContents, setFormContents, handleSubmit }) {
  const [curLetterCount, setCurLetterCount] = useState(0);

  const isNotAllInput = useCallback(() => {
    return (
      formContents[0].length === 0 ||
      formContents[1].length === 0 ||
      formContents[2] === null ||
      formContents[2].length === 0 ||
      formContents[3] === null ||
      formContents[3].length === 0 ||
      formContents[4].every(value => value === false)
    );
  }, [formContents]);

  const handleFormContents = useCallback(
    (index, newValue) => {
      const prevFormContents = [...formContents];
      prevFormContents[index] = newValue;
      setFormContents(prevFormContents);
    },
    [formContents, setFormContents],
  );

  const handleDays = useCallback(
    index => {
      const days = formContents[4];
      const prev = [...days];
      prev[index] = !prev[index];
      handleFormContents(4, prev);
    },
    [formContents, handleFormContents],
  );

  return (
    <FormStyle
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Header />
      <SubItem title="업무명">
        <BottomLineContainer>
          <TextInput
            type="text"
            name="업무명"
            placeholder="업무명 입력"
            onChange={e => {
              handleFormContents(0, e.target.value);
            }}
          />
        </BottomLineContainer>
      </SubItem>
      <SubItem title="과제 내용">
        <GoalContent>
          <Textarea
            className="typo-body-m"
            placeholder={
              "완료해야 할 일을 상세하게 작성해주세요!\n\nex)\n메가커피 마케팅 전략 조사 및 새로운 전략 도출\n  ppt 10장 내로\n  SWOT 조사 필수"
            }
            maxLength={1000}
            onChange={e => {
              if (formContents[1].length >= 1000) {
                return;
              }
              setCurLetterCount(e.target.value.length);
              handleFormContents(1, e.target.value);
            }}
          />
          <BottomLineContainer>
            <LetterCount>
              <Count>{curLetterCount}</Count>
              <Count>/1000</Count>
            </LetterCount>
          </BottomLineContainer>
        </GoalContent>
      </SubItem>
      <SubItem title="업무 수행 시작일">
        <CustomDatePicker index={2} onChange={handleFormContents} />
      </SubItem>
      <SubItem title="업무 수행 마감일">
        <CustomDatePicker index={3} onChange={handleFormContents} />
      </SubItem>
      <SubItem title="업무 수행 예정일">
        <Toggle>
          <CheckBox
            $toggle={toggle}
            onClick={() => {
              const prevFormContents = [...formContents];
              formContents[4].forEach((_, index) => {
                prevFormContents[4][index] = !toggle;
              });
              setToggle(prev => !prev);
            }}
          ></CheckBox>
          <EveryDay>매일</EveryDay>
        </Toggle>
        <WeekButtons checkDays={formContents[4]} handleDays={handleDays} />
      </SubItem>
      <Submit>
        <GreenButton disabled={isNotAllInput()}>할 일 나누기</GreenButton>
      </Submit>
    </FormStyle>
  );
}
