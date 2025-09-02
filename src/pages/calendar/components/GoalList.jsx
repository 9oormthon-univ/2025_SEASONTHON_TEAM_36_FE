import styled from 'styled-components';
import Goal from './Goal';

const GoalListStyle = styled.div`
  padding: 2px 10px;
  padding-bottom: 30px;
`;

const GoalList = ({ toDo }) => {
  return (
    <GoalListStyle>
      {Object.keys(toDo).map((goal, index) => {
        const oneGoal = toDo[goal];
        const objToArray = Object.keys(oneGoal).map(step => {
          return { name: step, id: oneGoal[step].id, done: oneGoal[step].done };
        });
        return <Goal key={index} goal={goal} steps={objToArray} />;
      })}
    </GoalListStyle>
  );
};

export default GoalList;
