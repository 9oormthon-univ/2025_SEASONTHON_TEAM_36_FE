import Title from './Title';
import CreateGoalButton from './CreateGoalButton';
import styled from 'styled-components';

const TaskToDoStyle = styled.div`
  display: flex;
  align-items: center;
`;

const TaskToDo = ({handleShowModal}) => {
  return (
    <TaskToDoStyle>
      <Title $fontSize={'var(--fs-lg)'}>Task To-Do</Title>
      <CreateGoalButton handleShowModal={handleShowModal} />
    </TaskToDoStyle>
  );
};

export default TaskToDo;
