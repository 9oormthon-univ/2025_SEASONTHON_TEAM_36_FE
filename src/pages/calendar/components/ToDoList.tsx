import styled from "styled-components";

import { Title } from "../styles";
import { ListProps } from "../types/props";
import GoalList from "./GoalList";

const ToDoListStyle = styled.div`
  margin-top: 10px;
  padding: 0 26px 90px 26px;
`;

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
