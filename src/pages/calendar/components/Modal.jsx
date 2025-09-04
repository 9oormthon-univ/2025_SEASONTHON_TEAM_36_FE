import styled from 'styled-components';
import CloseImg from '../../../assets/images/close.png';
import Title from './Title';
import TextInput from './TextInput';
import { useState } from 'react';

const ModalStyle = styled.div`
  background-color: white;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  top: ${props => props.$height}px;
  position: absolute;
  z-index: 1001;
  transition: top 0.2s linear;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 3px 24px;
`;

const CreateGoalForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  gap: 35px;
  padding: 0 30px;
`;

const CreateGoalFormChild = styled.div`
  > :first-child {
    margin-bottom: 16px;
  }
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

const Trick = styled.div`
  border-bottom: 1px solid var(--natural-400);
`;

const Modal = ({ modalRef, handleShowModal }) => {
  const [curLetterCount, setCurLetterCount] = useState(0);
  return (
    <ModalStyle ref={modalRef} $width={window.innerWidth} $height={window.innerHeight}>
      <Header>
        <button
          onClick={() => {
            handleShowModal();
          }}
        >
          <img src={CloseImg} alt="취소" width="24" height="24" />
        </button>
      </Header>
      <CreateGoalForm
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div style={{ padding: '24px 0' }}>
          <Title $fontSize={'var(--fs-2xl)'}>업무 추가하기</Title>
        </div>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무명</Title>
          <Trick>
            <TextInput type="text" name="업무명" placeholder="업무명 입력" />
          </Trick>
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>과제 내용</Title>
          <GoalContent>
            <Description>
              {
                '완료해야 할 일을 상세하게 작성해주세요!\n\nex) 메가커피 마케팅 전략 조사 및 새로운 전략 도출\n\tppt 10장 내로\n\tSWOT 조사 필수'
              }
            </Description>
            <Trick>
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
            </Trick>
          </GoalContent>
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무 수행 시작일</Title>
          <Trick>
            <TextInput type="date" name="업무 시작일" placeholder="YYYY.MM.DD" />
          </Trick>
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무 수행 마감일</Title>
          <Trick>
            <TextInput type="date" name="업무 시작일" placeholder="YYYY.MM.DD" />
          </Trick>
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무 수행 예정일</Title>
        </CreateGoalFormChild>
        {/* <SubmitButton>할 일 나누기</SubmitButton> */}
      </CreateGoalForm>
    </ModalStyle>
  );
};

export default Modal;
