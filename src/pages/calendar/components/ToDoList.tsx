import { Title } from "../styles";
import { ToDoListStyle } from "../styles/Goal";
import { ListProps } from "../types/props";
import GoalList from "./GoalList";

const ToDoList = ({ toDo, handleModifyStep, handleDeleteStep }: ListProps) => {
  return (
    <ToDoListStyle>
      <Title $fontSize={"var(--fs-lg)"}>Task To-Do</Title>
      <GoalList
        toDo={toDo}
        handleModifyStep={handleModifyStep}
        handleDeleteStep={handleDeleteStep}
      />
    </ToDoListStyle>
  );
};

export default ToDoList;
