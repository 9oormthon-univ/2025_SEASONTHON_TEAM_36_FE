import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import { calendarApi } from '../../../apis/calendar';
import LeftArrow from '../../../assets/images/left-arrow.png';
import RightArrow from '../../../assets/images/right-arrow.png';

const dateToFormatString = date => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const CustomCalendar = ({ curDate, handleToDo, handleMoveMonth }) => {
  const [stepCountOfDay, setStepCountOfDay] = useState(null);

  useEffect(() => {
    try {
      const getResponse = async () => {
        const response = await calendarApi(curDate.getFullYear(), curDate.getMonth() + 1);
        setStepCountOfDay(response);
      };
      getResponse();
    } catch (error) {
      alert(error);
    }
  }, [curDate]);

  const formatDay = (locale, date) => {
    const isSameDate = date.toDateString() === curDate.toDateString();
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '20px',
          height: '20px',
          backgroundColor: isSameDate ? 'var(--natural-400)' : 'transparent',
          borderRadius: '50%',
          fontSize: 'var(--fs-xs)',
        }}
      >
        {date.getDate().toString()}
      </div>
    );
  };

  const selectGreen = useCallback(ratio => {
    if (ratio <= 20) return 'var(--green-100)';
    if (ratio <= 40) return 'var(--green-200)';
    if (ratio <= 60) return 'var(--green-300)';
    if (ratio <= 80) return 'var(--green-400)';
    return 'var(--green-500)';
  }, []);

  const getTileContent = ({ activeStartDate, date, view }) => {
    // 월 보기일 때만 div 추가
    if (view === 'month') {
      const isSameDate = stepCountOfDay?.calendar.length
        ? dateToFormatString(date) === stepCountOfDay?.calendar[0].calendarDate
        : false;
      const percentage = isSameDate ? stepCountOfDay?.calendar[0].percentage : 0;
      return (
        <div
          style={{
            width: '23px',
            height: '23px',
            border: isSameDate && percentage ? 'none' : '1px solid var(--natural-400)',
            backgroundColor: isSameDate && percentage ? selectGreen(percentage) : '#ffffff',
            borderRadius: '4px',
            marginBottom: '2px',
          }}
        ></div>
      );
    }
    return null;
  };

  return (
    <Calendar
      onClickDay={(value, event) => {
        handleToDo(value);
      }}
      formatDay={formatDay}
      tileContent={getTileContent}
      prevLabel={
        <img
          src={LeftArrow}
          alt="left-arrow"
          width="24"
          onClick={() => {
            handleMoveMonth(-1);
          }}
        />
      }
      nextLabel={
        <img
          src={RightArrow}
          alt="right-arrow"
          width="24"
          onClick={_ => {
            handleMoveMonth(1);
          }}
        />
      }
      next2Label={
        <span
          style={{ fontSize: 'var(--fs-xs)' }}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {'월'}
        </span>
      }
    />
  );
};

export default CustomCalendar;
