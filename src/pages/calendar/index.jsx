import './styles/index.css';
import CustomCalendar from './components/CustomCalendar';
import ToDoList from './components/ToDoList';
import Modal from './components/Modal';
import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';

const CalendarStyle = styled.div`
  height: ${props => props.$height}px;
  position: relative;
  overflow: hidden;
`;

const CalendarScreen = () => {
  const [isShowing, setIsShowing] = useState(false);
  const modalRef = useRef(null);
  const handleShowModal = useCallback(() => {
    console.log(isShowing);
    console.log(isShowing ? `${window.innerHeight}px` : 0);
    modalRef.current.style.top = isShowing ? `${window.innerHeight}px` : 0;

    setIsShowing(prev => !prev);
  }, [isShowing]);
  return (
    <CalendarStyle $height={window.innerHeight}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <CustomCalendar />
        <ToDoList handleShowModal={handleShowModal} />
      </div>
      <Modal modalRef={modalRef} handleShowModal={handleShowModal} />
    </CalendarStyle>
  );
};

export default CalendarScreen;
