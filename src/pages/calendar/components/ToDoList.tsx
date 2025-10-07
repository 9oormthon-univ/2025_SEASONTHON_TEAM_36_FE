import styled from "styled-components";

import Plus from "../../../assets/images/plus.png";
import { Button, TaskToDo, Title } from "../styles";
import { ListProps } from "../types/props";
import GoalList from "./GoalList";

const ToDoListStyle = styled.div`
  margin-top: 10px;
  padding: 0 26px 90px 26px;
`;

const ToDoList = ({ toDo, handleShowModal, handleModifyStep, handleDeleteStep }: ListProps) => {
  return (
    <ToDoListStyle>
      <TaskToDo>
        <Title $fontSize={"var(--fs-lg)"}>Task To-Do</Title>
        <Button
          onClick={() => {
            handleShowModal?.();
          }}
        >
          <img src={Plus} alt="plus" width="18" height="18" />
        </Button>
      </TaskToDo>
      <GoalList
        toDo={toDo}
        handleModifyStep={handleModifyStep}
        handleDeleteStep={handleDeleteStep}
      />
    </ToDoListStyle>
  );
};

export default ToDoList;
