import { useCallback, useState } from 'react';
import styled from 'styled-components';

import GreenButton from '../../../../common/components/GreenButton';
import TextInput from '../TextInput';
import CustomDatePicker from './CustomDatePicker';
import Header from './Header';
import SubItem from './Input';
import WeekButtons from './WeekButtons';

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

const Description = styled.div`
  color: var(--natural-800);
  font-size: var(--fs-md);
  line-height: 24px;
  letter-spacing: var(--ls-3);
  white-space: pre-wrap;
`;

const LetterCount = styled.div`
  display: flex;
  position: absolute;
  bottom: 24px;
  right: 10px;
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

export default function Form({ formContents, setFormContents, handleSubmit }) {
  const [curLetterCount, setCurLetterCount] = useState(0);

  const isNotAllInput = useCallback(() => {
    return (
      formContents[0].length === 0 ||
      (formContents[1].length === 0 && formContents[2] === null) ||
      formContents[3] === null ||
      formContents[4].every(value => value === true)
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
            onSubmit={e => {
              handleFormContents(0, e.target.value);
            }}
          />
        </BottomLineContainer>
      </SubItem>
      <SubItem title="과제 내용">
        <GoalContent>
          <Description>
            {
              '완료해야 할 일을 상세하게 작성해주세요!\n\nex) 메가커피 마케팅 전략 조사 및 새로운 전략 도출\n\tppt 10장 내로\n\tSWOT 조사 필수'
            }
          </Description>
          <BottomLineContainer>
            <TextInput
              type="text"
              name="업무 내용"
              maxLength="1000"
              style={{
                paddingRight: '80px',
              }}
              onChange={e => {
                if (formContents[1].length >= 1000) {
                  return;
                }
                setCurLetterCount(e.target.value.length);
                handleFormContents(1, e.target.value);
              }}
            />
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
        <WeekButtons checkDays={formContents} handleDays={handleDays} />
      </SubItem>
      <Submit>
        <GreenButton disabled={isNotAllInput()}>할 일 나누기</GreenButton>
      </Submit>
    </FormStyle>
  );
}
