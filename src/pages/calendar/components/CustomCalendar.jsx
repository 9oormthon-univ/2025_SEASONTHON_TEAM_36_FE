import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import { calendarApi } from '../../../apis/calendar';
import LeftArrow from '../../../assets/images/left-arrow.png';
import RightArrow from '../../../assets/images/right-arrow.png';
import { dateToFormatString } from '../utils/dateUtils';

const CustomCalendar = ({
  curDate,
  handleToDo,
  handleMoveMonth,
  handleMoveWeek,
  startDayOfWeek,
  endDayOfWeek,
  monthMode,
  handleMonthMode,
}) => {
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
    <div style={{ position: 'relative' }}>
      <Calendar
        onClickDay={(value, event) => {
          handleToDo(value);
        }}
        formatDay={formatDay}
        tileContent={getTileContent}
        tileDisabled={({ date }) => {
          if (!monthMode) {
            const dateStr = dateToFormatString(date);
            return (
              dateStr < dateToFormatString(startDayOfWeek) ||
              dateStr > dateToFormatString(endDayOfWeek)
            );
          }
        }}
        prevLabel={
          <img
            src={LeftArrow}
            alt="left-arrow"
            width="24"
            onClick={e => {
              if (monthMode) {
                handleMoveMonth(-1);
              } else {
                const nextDate = new Date(curDate);
                nextDate.setDate(nextDate.getDate() + -1 * 7);
                if (nextDate.getMonth() == curDate.getMonth()) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleMoveWeek(-1);
              }
            }}
          />
        }
        nextLabel={
          <img
            src={RightArrow}
            alt="right-arrow"
            width="24"
            onClick={e => {
              if (monthMode) {
                handleMoveMonth(1);
              } else {
                const nextDate = new Date(curDate);
                nextDate.setDate(nextDate.getDate() + 1 * 7);
                if (nextDate.getMonth() == curDate.getMonth()) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleMoveWeek(1);
              }
            }}
          />
        }
      />
      <span
        style={{
          borderRadius: '10px',
          padding: '4px 10px',
          backgroundColor: 'var(--natural-200)',
          fontSize: 'var(--fs-xs)',
          cursor: 'pointer',
          position: 'absolute',
          top: '16px',
          right: '25px',
        }}
        onClick={_ => {
          handleMonthMode();
        }}
      >
        {monthMode ? '월' : '주'}
      </span>
    </div>
  );
};

export default CustomCalendar;
