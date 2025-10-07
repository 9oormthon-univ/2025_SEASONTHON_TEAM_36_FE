import { Day, Days } from "../styles/Form";
import { WeekButtonsProps } from "../types/props";

const WeekButtons = ({ checkDays, handleDays }: WeekButtonsProps) => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return (
    <Days>
      {days.map((day, index) => (
        <Day
          key={index}
          $checked={checkDays[index]}
          onClick={() => {
            handleDays(index);
          }}
        >
          {day}
        </Day>
      ))}
    </Days>
  );
};

export default WeekButtons;
