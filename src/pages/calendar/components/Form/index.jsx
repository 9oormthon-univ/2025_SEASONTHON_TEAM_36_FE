import styled from 'styled-components';
import { useCallback, useState } from 'react';

import TextInput from '../TextInput';
import SubItem from './Input';
import Header from './Header';
import CustomDatePicker from './CustomDatePicker';
import WeekButtons from './WeekButtons';
import GreenButton from '../../../../common/components/GreenButton';

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

export default function Form({ handleSubmit }) {
  const [curLetterCount, setCurLetterCount] = useState(0);
  const [days, setDays] = useState([false, false, false, false, false, false, false]);
  const handleDays = useCallback(
    index => {
      const prev = [...days];
      prev[index] = !prev[index];
      setDays(prev);
    },
    [days, setDays],
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
          <TextInput type="text" name="업무명" placeholder="업무명 입력" />
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
                setCurLetterCount(e.target.value.length);
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
        <CustomDatePicker />
      </SubItem>
      <SubItem title="업무 수행 마감일">
        <CustomDatePicker />
      </SubItem>
      <SubItem title="업무 수행 예정일">
        <WeekButtons checkDays={days} handleDays={handleDays} />
      </SubItem>
      <Submit>
        <GreenButton onClick={() => {}}>할 일 나누기</GreenButton>
      </Submit>
    </FormStyle>
  );
}
