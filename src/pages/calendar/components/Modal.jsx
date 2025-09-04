import styled from 'styled-components';
import CloseImg from '../../../assets/images/close.png';
import FrogOneImg from '../../../assets/images/frog1.svg';
import Form from './Form';
import FrogNoti from '../../../common/components/FrogNoti';

import { useCallback, useState } from 'react';

const ModalStyle = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: ${props => (props.$open ? 0 : 100)}%;
  z-index: 1001;
  transition: top 0.2s linear;
  overflow: auto;

  display: flex;
  flex-direction: column;

  padding-bottom: 55px;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  margin-top: 20px;
  padding: 3px 24px;
`;

const Modal = ({ open, handleShowModal }) => {
  /**
   * 0: 폼 작성
   * 1: 폼 처리 중
   * 2: 폼 처리 완료
   */
  const [status, setStatus] = useState(0);

  const handleSubmit = useCallback(() => {
    setStatus(prev => prev + 1);
    setTimeout(() => {
      setStatus(prev => prev + 1);
    }, 2000);
  }, [setStatus]);

  return (
    <ModalStyle $open={open}>
      <Header>
        <button>
          <img
            src={CloseImg}
            alt="취소"
            width="24"
            height="24"
            onClick={() => {
              handleShowModal();
              setStatus(0);
            }}
          />
        </button>
      </Header>
      {status === 0 ? (
        <Form handleSubmit={handleSubmit} />
      ) : status === 1 ? (
        <FrogNoti
          topText="개구리를 탈출시킬 계획을\n다시 수립하고 있어요"
          imageSrc={FrogOneImg}
          bottomText="조금만 기다려주세요..."
        />
      ) : (
        <div>처리 완료!</div>
      )}
    </ModalStyle>
  );
};

export default Modal;
