import styled from 'styled-components';
import CancelImg from '../../../assets/images/cancel.png';
import Title from './Title';

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

const TextInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid var(--natural-400);
  letter-spacing: -0.25px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--text-2);
    font-size: var(--fs-md);
  }
`;

const Modal = ({ modalRef, handleShowModal }) => {
  return (
    <ModalStyle ref={modalRef} $width={window.innerWidth} $height={window.innerHeight}>
      <Header>
        <button
          onClick={() => {
            handleShowModal();
          }}
        >
          <img src={CancelImg} alt="취소" width="24" height="24" />
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
          <TextInput type="text" name="업무명" placeholder="업무명 입력" />
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>과제 내용</Title>
          
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무 수행 시작일</Title>
        </CreateGoalFormChild>
        <CreateGoalFormChild>
          <Title $fontSize={'var(--fs-xl)'}>업무 수행 마감일</Title>
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
