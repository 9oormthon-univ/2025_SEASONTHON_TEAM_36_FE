import styled from "styled-components";

import GoalList from "./GoalList";
import TaskToDo from "./TaskToDo";

const ToDoListStyle = styled.div`
  margin-top: 10px;
  padding: 0 26px 90px 26px;
`;

const ToDoList = ({ toDo, handleShowModal, handleModifyStep, handleDeleteStep }) => {
  return (
    <ToDoListStyle>
      <TaskToDo handleShowModal={handleShowModal} />
      <GoalList
        toDo={toDo}
        handleModifyStep={handleModifyStep}
        handleDeleteStep={handleDeleteStep}
      />
    </ToDoListStyle>
  );
};

export default ToDoList;
