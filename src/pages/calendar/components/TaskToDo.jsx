import styled from 'styled-components';

import ModalOpenButton from './ModalOpenButton';
import Title from './Title';

const TaskToDoStyle = styled.div`
  display: flex;
  align-items: center;
`;

const TaskToDo = ({ handleShowModal }) => {
  return (
    <TaskToDoStyle>
      <Title $fontSize={'var(--fs-lg)'}>Task To-Do</Title>
      <ModalOpenButton handleShowModal={handleShowModal} />
    </TaskToDoStyle>
  );
};

export default TaskToDo;
