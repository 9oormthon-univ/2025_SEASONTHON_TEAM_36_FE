import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import DeleteImg from '../../../assets/images/delete.png';
import ModifyImg from '../../../assets/images/modify.png';
import MoreImg from '../../../assets/images/more.png';

const MoreButton = styled.button`
  background: none;
  border: none;
`;

const StepManagerStyle = styled.div`
  position: relative;
  margin-left: 10.5px;
`;

const StepManagerOptions = styled.div`
  display: flex;
  background-color: white;
  position: absolute;
  width: 120px;
  flex-direction: column;
  left: -95px;
  border-radius: 10.9px;
  padding: 7.63px 9.81px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.25);
  transform: ${props => (props.$isShowing ? 'scale(1)' : 'scale(0.9)')};
  opacity: ${props => (props.$isShowing ? 1 : 0)};
  transform-origin: top;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  pointer-events: ${props => (props.$isShowing ? 'auto' : 'none')};
  z-index: 51;
`;

const StepManagerOption = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3px 4px 3px 0;
  font-size: var(--fs-md);
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 6.54px 0;
`;

const StepManager = ({ isModify, setIsModify, handleModifyStep, handleDeleteStep }) => {
  const managerRef = useRef(null);
  const [isShowing, setIsShowing] = useState(false);
  const handleShowManager = useCallback(() => {
    setIsShowing(prev => !prev);
  }, []);

  return (
    <StepManagerStyle>
      <MoreButton
        onClick={() => {
          if (isModify) {
            handleModifyStep();
            setIsModify(prev => !prev);
          } else handleShowManager();
        }}
      >
        <img src={MoreImg} alt="더보기" width="24" height="24" />
      </MoreButton>
      <StepManagerOptions ref={managerRef} $isShowing={isShowing}>
        <StepManagerOption
          onClick={() => {
            setIsModify(prev => !prev);
            handleShowManager();
          }}
        >
          <span>수정하기</span>
          <img src={ModifyImg} alt="수정" width="18" height="18" />
        </StepManagerOption>
        <Divider />
        <StepManagerOption onClick={handleDeleteStep}>
          <span>삭제하기</span>
          <img src={DeleteImg} alt="삭제" width="18" height="18" />
        </StepManagerOption>
      </StepManagerOptions>
    </StepManagerStyle>
  );
};

export default StepManager;
