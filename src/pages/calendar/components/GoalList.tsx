import { GoalListStyle } from "../styles/Goal";
import { ListProps } from "../types/props";
import { GoalInfo } from "../types/ToDo";
import Goal from "./Goal";

const GoalList = ({ toDo, handleModifyStep, handleDeleteStep }: ListProps) => {
  return (
    <GoalListStyle>
      {toDo &&
        Object.keys(toDo)?.map((goal: string, index: number) => {
          const oneGoal: GoalInfo = toDo[Number(goal)];
          const objToArray = oneGoal.steps.map(step => {
            return { name: step.name, id: step.id, done: step.done };
          });
          return (
            <Goal
              key={index}
              goalId={Number(goal)}
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
