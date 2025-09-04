import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import LeftArrow from '../../../assets/images/left-arrow.png';
import RightArrow from '../../../assets/images/right-arrow.png';

const CustomCalendar = ({ curDate, maxSteps, handleMoveMonth }) => {
  const [selectedDate, setSelectedDate] = useState(curDate);

  useEffect(() => {
    setSelectedDate(curDate);
  }, [curDate]);

  const formatDay = (locale, date) => {
    const isSameDate = date.toDateString() === selectedDate.toDateString();
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

  const selectGreen = useCallback(count => {
    const quotient = Math.floor(maxSteps / 5);
    const remain = maxSteps % 5;
    const twentyPercent = quotient;
    const fortyPercent = quotient * 2 + (remain >= 4 ? remain - 3 : 0);
    const sixtyPercent = quotient * 3 + (remain >= 3 ? remain - 2 : 0);
    const eightyPercent = quotient * 4 + (remain >= 2 ? remain - 1 : 0);
    if (count <= twentyPercent) return 'var(--green-100)';
    if (count <= fortyPercent) return 'var(--green-200)';
    if (count <= sixtyPercent) return 'var(--green-300)';
    if (count <= eightyPercent) return 'var(--green-400)';
    return 'var(--green-500)';
  }, []);

  const getTileContent = ({ activeStartDate, date, view }) => {
    let count = 0;
    // 월 보기일 때만 div 추가
    if (view === 'month') {
      return (
        <div
          style={{
            width: '23px',
            height: '23px',
            border: count > 0 ? 'none' : '1px solid var(--natural-400)',
            backgroundColor: count > 0 ? selectGreen(count) : '#ffffff',
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
        setSelectedDate(value);
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
            setSelectedDate(curDate);
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
            setSelectedDate(curDate);
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
