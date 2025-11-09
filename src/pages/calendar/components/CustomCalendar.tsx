import { useCallback, useEffect, useState } from "react";
import Calendar, { OnArgs } from "react-calendar";

import { calendarApi } from "@/apis/calendar";
import LeftArrow from "@/assets/images/left-arrow.png";
import RightArrow from "@/assets/images/right-arrow.png";
import { dateToFormatString } from "@/common/utils/dateUtils";

import { useCalendar } from "../stores/useCalendar";

const CustomCalendar = () => {
  const [percentageOfDay, setPercentageOfDay] = useState<Record<string, number> | null>(null);
  const curDate = useCalendar(state => state.curDate);
  const handleMoveMonth = useCalendar(state => state.handleMoveMonth);
  const handleToDo = useCalendar(state => state.handleToDo);
  const setView = useCalendar(state => state.setView);

  useEffect(() => {
    calendarApi(curDate.getFullYear(), curDate.getMonth() + 1)
      .then(response => {
        const tmpPercentageOfDay: Record<string, number> = {};
        response?.calendar.forEach(value => {
          tmpPercentageOfDay[value.calendarDate] = value.percentage;
        });
        setPercentageOfDay(tmpPercentageOfDay);
      })
      .catch(error => {
        alert(error);
      });
  }, [curDate]);

  // This should return a string for formatDay prop
  const formatDay = (_locale: string | undefined, date: Date): string => {
    return date.getDate().toString();
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateOfCurDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
    return date.getTime() === dateOfCurDate.getTime() ? "selected-date" : null;
  };

  const selectGreen = useCallback((ratio: number) => {
    if (ratio <= 20) return "var(--green-100)";
    if (ratio <= 40) return "var(--green-200)";
    if (ratio <= 60) return "var(--green-300)";
    if (ratio <= 80) return "var(--green-400)";
    return "var(--green-500)";
  }, []);

  const getTileContent = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
    activeStartDate?: Date;
    key?: string;
  }) => {
    // 월 보기일 때만 div 추가
    if (view === "month") {
      const percentage: number = percentageOfDay
        ? (percentageOfDay[dateToFormatString(date)] ?? 0)
        : 0;
      return (
        <div
          style={{
            border: percentage > 0 ? "none" : "2px solid var(--natural-400)",
            backgroundColor: percentage > 0 ? selectGreen(percentage) : "#ffffff",
          }}
        ></div>
      );
    }
    return null;
  };
  return (
    <div style={{ position: "relative" }}>
      <Calendar
        onClickDay={value => {
          handleToDo(value);
        }}
        onViewChange={({ activeStartDate, view }) => {
          setView(view);
          if (view === "month") {
            handleToDo(activeStartDate as Date);
          }
        }}
        formatDay={formatDay}
        tileContent={getTileContent}
        tileClassName={tileClassName}
        prevLabel={
          <img
            src={LeftArrow as string}
            alt="left-arrow"
            width="24"
            onClick={_ => {
              handleMoveMonth(-1);
            }}
          />
        }
        nextLabel={
          <img
            src={RightArrow as string}
            alt="right-arrow"
            width="24"
            onClick={_ => {
              handleMoveMonth(1);
            }}
          />
        }
      />
    </div>
  );
};

export default CustomCalendar;
