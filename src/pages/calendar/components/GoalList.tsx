import styled from "styled-components";

import Goal from "./Goal";

const GoalListStyle = styled.div`
  padding: 2px 10px;
  padding-bottom: 76px;
`;

const GoalList = ({ toDo, handleModifyStep, handleDeleteStep }) => {
  return (
    <GoalListStyle>
      {toDo &&
        Object.keys(toDo)?.map((goal, index) => {
          const oneGoal = toDo[goal];
          const objToArray = oneGoal.steps.map(step => {
            return { name: step.name, id: step.id, done: step.done };
          });
          return (
            <Goal
              key={index}
              goalId={goal}
              goal={oneGoal.name}
              steps={objToArray}
              handleModifyStep={handleModifyStep}
              handleDeleteStep={handleDeleteStep}
            />
          );
        })}
    </GoalListStyle>
  );
};

export default GoalList;
