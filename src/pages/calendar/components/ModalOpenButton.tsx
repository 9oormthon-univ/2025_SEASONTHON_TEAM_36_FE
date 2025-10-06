import styled from "styled-components";

import Plus from "../../../assets/images/plus.png";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ModalOpenButton = ({ handleShowModal }) => {
  return (
    <Button
      onClick={() => {
        handleShowModal();
      }}
    >
      <img src={Plus} alt="plus" width="18" height="18" />
    </Button>
  );
};

export default ModalOpenButton;
