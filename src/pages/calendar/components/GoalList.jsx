import styled from 'styled-components';
import Goal from './Goal';

const GoalListStyle = styled.div`
  padding: 2px 10px;
  padding-bottom: 30px;
`;

const GoalList = () => {
  return (
    <GoalListStyle>
      <Goal goal={'Goal 1'} steps={['step 1']} />
      <Goal goal={'Goal 2'} steps={['step 2', 'step3']} />
    </GoalListStyle>
  );
};

export default GoalList;
