import { useCalendar } from "../stores/useCalendar";
import { GoalListStyle } from "../styles/Goal";
import { GoalInfo } from "../types/ToDo";
import Goal from "./Goal";

const GoalList = () => {
  const curToDo = useCalendar(state => state.curToDo);
  return (
    <GoalListStyle>
      {curToDo &&
        Object.keys(curToDo)?.map((goal: string, index: number) => {
          const oneGoal: GoalInfo = curToDo[Number(goal)];
          const objToArray = oneGoal.steps.map(step => {
            return { name: step.name, id: step.id, done: step.done };
          });
          return <Goal key={index} goalId={Number(goal)} goal={oneGoal.name} steps={objToArray} />;
        })}
    </GoalListStyle>
  );
};

export default GoalList;
