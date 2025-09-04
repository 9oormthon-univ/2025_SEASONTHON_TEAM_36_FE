import './styles/index.css';
import CustomCalendar from './components/CustomCalendar';
import ToDoList from './components/ToDoList';
import Modal from './components/Modal';
import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dummy9 } from './utils/dummy';
import axios from 'axios';
import { getAccessToken } from '../../common/utils/token';

const CalendarScreenStyle = styled.div`
  height: ${props => props.$height}px;
  position: relative;
  overflow: hidden;
`;

const CalendarScreen = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [yearMonth, setYearMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
  );
  const [day, setDay] = useState(new Date().getDate());
  const [allToDo, setAllToDo] = useState({});
  const [allToDoOfMonth, setAllToDoOfMonth] = useState(dummy9);
  const [toDo, setToDo] = useState(dummy9[new Date().getDate()] ?? {});
  const modalRef = useRef(null);

  // useEffect(() => {
  //   const getMyToDo = async () => {
  //     try {
  //       const accessToken = getAccessToken();
  //       console.log(accessToken);
  //       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         withCredentials: true,
  //       });
  //       console.log(response.data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getMyToDo();
  // }, []);

  const handleShowModal = useCallback(() => {
    modalRef.current.style.top = isShowing ? `${window.innerHeight}px` : 0;
    setIsShowing(prev => !prev);
  }, [isShowing]);

  const handleToDo = useCallback(
    selectedDate => {
      const date = new Date(selectedDate);
      const dayOfSelectedDate = date.getDate();
      setDay(dayOfSelectedDate);
      setToDo(allToDoOfMonth[dayOfSelectedDate] ?? {});
    },
    [setDay, setToDo],
  );

  const handleMovePrev = useCallback(() => {
    const prevDate = new Date(yearMonth);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;
    const nextYear = prevMonth - 1 <= 0 ? prevYear - 1 : prevYear;
    const nextMonth = prevMonth - 1 <= 0 ? 12 : prevMonth - 1;
    setYearMonth(`${nextYear}-${nextMonth}`);
    setDay(1);
    setToDo(allToDoOfMonth[1] ?? {});
    console.log(`${nextYear}-${nextMonth}`);
  }, [yearMonth, setYearMonth, setDay]);

  const handleMoveNext = useCallback(() => {
    const prevDate = new Date(yearMonth);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;
    const nextYear = prevMonth + 1 > 12 ? prevYear + 1 : prevYear;
    const nextMonth = prevMonth + 1 > 12 ? 1 : prevMonth + 1;
    setYearMonth(`${nextYear}-${nextMonth}`);
    setDay(1);
    setToDo(allToDoOfMonth[1] ?? {});
    console.log(`${nextYear}-${nextMonth}`);
  }, [yearMonth, setYearMonth, setDay]);

  return (
    <CalendarScreenStyle $height={window.innerHeight}>
      <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <CustomCalendar
          curDate={new Date(`${yearMonth}-${day}`)}
          allToDo={allToDoOfMonth}
          maxSteps={6} // 하드코딩
          handleToDo={handleToDo}
          handleMovePrev={handleMovePrev}
          handleMoveNext={handleMoveNext}
        />
        <ToDoList toDo={toDo} handleShowModal={handleShowModal} />
      </div>
      <Modal modalRef={modalRef} handleShowModal={handleShowModal} />
    </CalendarScreenStyle>
  );
};

export default CalendarScreen;
