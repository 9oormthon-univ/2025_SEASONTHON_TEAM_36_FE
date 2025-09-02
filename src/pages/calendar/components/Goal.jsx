import styled from 'styled-components';
import DotImg from '../../../assets/images/dot.png';
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

const Goal = ({ goal, steps }) => {
  return (
    <GoalStyle>
      <GoalContainer>
        <GoalDivider />
        <GoalName>{goal}</GoalName>
      </GoalContainer>
      <StepList>
        {steps.map(step => {
          return (
            <Step key={step.id} id={step.id}>
              <StepContent>
                <StepCheckBox $did={step.done} />
                <StepName>{step.name}</StepName>
              </StepContent>
              <StepManager />
            </Step>
          );
        })}
      </StepList>
    </GoalStyle>
  );
};

export default Goal;
