import leftBtnDiaryImg from "@/assets/images/left-btn-diary.svg";
import rightBtnDiaryImg from "@/assets/images/right-btn-diary.svg";

import { Month, Wrapper } from "../styles/NightSky";

const Button = ({
  handleMoveMonth,
  move,
}: {
  handleMoveMonth: (move: number) => void;
  move: number;
}) => {
  const imgSrc = move > 0 ? rightBtnDiaryImg : leftBtnDiaryImg;
  const imgAlt = move > 0 ? "오른쪽 버튼" : "왼쪽 버튼";
  return (
    <button
      onClick={() => {
        handleMoveMonth(move);
      }}
    >
      <img src={imgSrc} alt={imgAlt} />
    </button>
  );
};

const NightSky = ({
  handleMoveMonth,
  date,
}: {
  handleMoveMonth: (move: number) => void;
  date: Date;
}) => {
  return (
    <Wrapper>
      <Button handleMoveMonth={handleMoveMonth} move={-1} />
      <Month>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 밤하늘`}</Month>
      <Button handleMoveMonth={handleMoveMonth} move={1} />
    </Wrapper>
  );
};

export default NightSky;
