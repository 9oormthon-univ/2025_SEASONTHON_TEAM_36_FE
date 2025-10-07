import { useCallback, useState } from "react";

import GreenButton from "@/common/components/GreenButton";

import { TextInput, Title } from "../styles";
import {
  BottomLineContainer,
  CheckBox,
  Count,
  EveryDay,
  FormStyle,
  GoalContent,
  Header,
  LetterCount,
  Submit,
  Textarea,
  Toggle,
} from "../styles/Form";
import { FormProps } from "../types/props";
import CustomDatePicker from "./CustomDatePicker";
import FormField from "./FormField";
import WeekButtons from "./WeekButtons";

export default function Form({
  toggle,
  setToggle,
  formContents,
  setFormContents,
  handleSubmit,
}: FormProps) {
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
    (index: number, newValue: string | boolean[]) => {
      setFormContents(prev => {
        const updated = [...prev];
        updated[index] = newValue;
        return updated as [string, string, string | null, string | null, boolean[]];
      });
    },
    [setFormContents],
  );

  const handleDays = useCallback(
    (index: number) => {
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
      <Header>
        <Title $fontSize={"var(--fs-2xl)"}>업무 추가하기</Title>
      </Header>
      <FormField title="업무명">
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
      </FormField>
      <FormField title="과제 내용">
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
      </FormField>
      <FormField title="업무 수행 시작일">
        <CustomDatePicker index={2} onChange={handleFormContents} />
      </FormField>
      <FormField title="업무 수행 마감일">
        <CustomDatePicker index={3} onChange={handleFormContents} />
      </FormField>
      <FormField title="업무 수행 예정일">
        <Toggle>
          <CheckBox
            $toggle={toggle}
            onClick={() => {
              setFormContents(prev => {
                const updated = [...prev];
                const newDays = [...prev[4]].map(() => !toggle);
                updated[4] = newDays;
                return updated as [string, string, string | null, string | null, boolean[]];
              });
              setToggle(prev => !prev);
            }}
          ></CheckBox>
          <EveryDay>매일</EveryDay>
        </Toggle>
        <WeekButtons checkDays={formContents[4]} handleDays={handleDays} />
      </FormField>
      <Submit>
        <GreenButton onClick={() => {}} disabled={isNotAllInput()}>
          할 일 나누기
        </GreenButton>
      </Submit>
    </FormStyle>
  );
}
