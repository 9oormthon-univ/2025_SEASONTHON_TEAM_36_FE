import styled from 'styled-components';
import DotImg from '../../../assets/images/dot.png';
import MoreImg from '../../../assets/images/more.png';
import ModifyImg from '../../../assets/images/modify.png';
import DeleteImg from '../../../assets/images/delete.png';
import { useCallback, useRef, useState } from 'react';
import StepManager from './StepManager';

const GoalStyle = styled.div`
  margin-top: 16px;
`;

const GoalContainer = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  background-color: var(--natural-200);
  border-radius: 10px;
  padding: 4px 10px;
  width: ;
`;

const GoalName = styled.span`
  font-size: var(--fs-xs);
`;

const GoalDivider = () => {
  return <img src={DotImg} alt="Goal 강조점" width="6" height="6" style={{ marginRight: '6px' }} />;
};

const StepList = styled.div``;

const Step = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 4px 4.5px;
`;

const StepContent = styled.div`
  display: flex;
  align-items: center;
`;

const StepCheckBox = styled.div`
  width: 23px;
  height: 23px;
  margin-right: 13px;
  border: ${props => (props.$did ? 'none' : '2px solid var(--natural-400)')};
  background-color: ${props => (props.$did ? 'var(--green-100)' : 'transparent')};
  border-radius: 4px;
`;

const StepName = styled.span`
  font-size: var(--fs-md);
  font-weight: 500;
`;

// const StepManager = () => {
//   const managerRef = useRef(null);
//   const [isShowing, setIsShowing] = useState(false);
//   const handleShowManager = useCallback(() => {
//     setIsShowing(prev => !prev);
//   }, [isShowing]);
//   return (
//     <div
//       style={{
//         position: 'relative',
//       }}
//     >
//       <button
//         style={{
//           background: 'none',
//           border: 'none',
//         }}
//         onClick={() => {
//           handleShowManager();
//         }}
//       >
//         <img src={MoreImg} alt="더보기" width="24" height="24" />
//       </button>
//       <div
//         ref={managerRef}
//         style={{
//           display: 'flex',
//           position: 'absolute',
//           width: '120px',
//           flexDirection: 'column',
//           left: '-95px',
//           borderRadius: '10.9px',
//           padding: '7.63px 9.81px',
//           boxShadow: '0px 0px 5px 1px rgba(0, 0, 0, 0.25)',
//           transform: isShowing ? 'scale(1)' : 'scale(0.9)',
//           opacity: isShowing ? 1 : 0,
//           transformOrigin: 'top', // 애니메이션 시작 지점
//           transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
//           pointerEvents: isShowing ? 'auto' : 'none', // 안 보일 때 클릭 방지
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             padding: '3px 4px 3px 0',
//             fontSize: 'var(--fs-md)',
//           }}
//         >
//           <span>수정하기</span>
//           <img src={ModifyImg} alt="수정" width="18" height="18" />
//         </div>
//         <div
//           style={{
//             height: '1px',
//             backgroundColor: '#e0e0e0',
//             margin: '6.54px 0',
//           }}
//         ></div>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             padding: '3px 4px 3px 0',
//             fontSize: 'var(--fs-md)',
//           }}
//         >
//           <span>삭제하기</span>
//           <img src={DeleteImg} alt="삭제" width="18" height="18" />
//         </div>
//       </div>
//     </div>
//   );
// };

const Goal = ({goal, steps}) => {
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalDivider />
        <GoalName>Goal 2</GoalName>
      </GoalContainer>
      <StepList>
        <Step>
          <StepContent>
            <StepCheckBox $did={false} />
            <StepName>Step 4</StepName>
          </StepContent>
          <StepManager />
        </Step>
      </StepList>
    </GoalStyle>
  );
};

export default Goal;