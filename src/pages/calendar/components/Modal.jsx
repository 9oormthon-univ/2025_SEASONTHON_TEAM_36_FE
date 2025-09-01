import styled from 'styled-components';

const ModalStyle = styled.div`
  background-color: white;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  top: ${props => props.$height}px;
  position: absolute;
  z-index: 100;
  transition: top 0.2s linear;
`;

const Close = styled.button``;

const Modal = ({ modalRef, handleShowModal }) => {
  return (
    <ModalStyle ref={modalRef} $width={window.innerWidth} $height={window.innerHeight}>
      <Close
        onClick={() => {
          handleShowModal();
        }}
      >
        x
      </Close>
    </ModalStyle>
  );
};

export default Modal;
