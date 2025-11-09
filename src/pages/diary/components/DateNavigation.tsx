import leftBtnDiaryImg from "@/assets/images/left-btn-diary.svg";
import rightBtnDiaryImg from "@/assets/images/right-btn-diary.svg";

// import { checkLuanchingDate, checkOverDate } from "@/common/utils/dateUtils";
import { ButtonImg, Month, Wrapper } from "../styles/DateNavigation";

const Button = ({
  handleMoveMonth,
  move,
  hide,
}: {
  handleMoveMonth: (move: number) => void;
  move: number;
  hide?: boolean | null;
}) => {
  const imgSrc = move > 0 ? rightBtnDiaryImg : leftBtnDiaryImg;
  const imgAlt = move > 0 ? "오른쪽 버튼" : "왼쪽 버튼";
  return (
    <button
      style={{
        display: "flex",
        opacity: hide ? 0 : 1,
        cursor: hide ? "auto" : "pointer",
      }}
      onClick={() => {
        if (hide) return;
        handleMoveMonth(move);
      }}
    >
      <ButtonImg src={imgSrc} alt={imgAlt} />
    </button>
  );
};

const DateNavigation = ({
  handleMoveMonth,
  date,
}: {
  handleMoveMonth: (move: number) => void;
  date: Date;
}) => {
  // const isOverDate = checkOverDate(date);
  // const isLuanchingDate = checkLuanchingDate(date);

  return (
    <Wrapper>
      <Button handleMoveMonth={handleMoveMonth} move={-1} hide={false} />
      <Month>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 밤하늘`}</Month>
      <Button handleMoveMonth={handleMoveMonth} move={1} hide={false} />
    </Wrapper>
  );
};

export default DateNavigation;
