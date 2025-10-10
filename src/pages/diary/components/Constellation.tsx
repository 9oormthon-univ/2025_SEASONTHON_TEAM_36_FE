import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import starImg from "@/assets/images/stars/star-0.svg";

import { dateToFormatString } from "../../calendar/utils/dateUtils";
import { dummy } from "../constants/dummy";
import { EMOTION_IMG } from "../constants/emotion_img";
import { LINES } from "../constants/line";
import { MONTH_CONSTELLATION } from "../constants/month";
import { Day, Line, Star, StarImg, ToggleButton, Wrapper } from "../styles/Constellation";
import { Coordinate } from "../types/Coordinate";
import type { Diary } from "../types/Diary";

const calcLineLocation = (
  star1: Coordinate,
  star2: Coordinate,
  isStar1Big: boolean,
  isStar2Big: boolean,
) => {
  // 별의 크기에 따른 반지름 계산 (큰 별: 17.1px, 작은 별: 8px)
  const star2Radius = isStar2Big ? 17.1 : 8;

  const dx = star1.x - star2.x;
  const dy = star1.y - star2.y;
  const distance = Math.sqrt(dx * dx + dy * dy) + (isStar1Big !== isStar2Big ? 2 : 0);
  const angle =
    Math.atan2(dy, dx) * (180 / Math.PI) +
    (isStar1Big && isStar2Big ? 0 : isStar1Big && !isStar2Big && star1.y < star2.y ? 5 : -5);

  // 시작점 (star2에서 star1 방향으로 별의 반지름만큼 이동)
  const startX = star2.x + star2Radius;
  const startY = star2.y + star2Radius;

  return {
    left: startX,
    top: startY,
    distance,
    angle,
  };
};

const Constellation = ({ date }: { date: Date }) => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState<boolean>(false);

  const handleStarClick = useCallback(
    (diaryInfo: Diary, dateString: string) => {
      void (diaryInfo
        ? navigate(`/diary/${diaryInfo.id}`, { state: diaryInfo })
        : navigate("/diary/writing", { state: dateString }));
    },
    [navigate],
  );

  return (
    <Wrapper>
      {MONTH_CONSTELLATION[date.getMonth() + 1] &&
        Object.keys(MONTH_CONSTELLATION[date.getMonth() + 1]).map((day: string, index: number) => {
          const constellation = MONTH_CONSTELLATION[date.getMonth() + 1][Number(day)];
          const dateString = dateToFormatString(
            new Date(date.getFullYear(), date.getMonth(), Number(day)),
          );
          const diaryInfo = dummy[dateString];
          const image: string = diaryInfo ? EMOTION_IMG[diaryInfo.emotion] : starImg;

          return (
            <Star
              key={index}
              $x={constellation.star.x}
              $y={constellation.star.y}
              onClick={() => {
                handleStarClick(diaryInfo, dateString);
              }}
            >
              <StarImg src={image} alt="별" $big={constellation.big} />
              <Day $toggle={toggle} $x={constellation.text?.x ?? 0} $y={constellation.text?.y ?? 0}>
                {day}
              </Day>
            </Star>
          );
        })}
      {LINES[date.getMonth() + 1]?.map((edge: number[], index: number) => {
        const [start, end] = edge;
        const startConstellation = MONTH_CONSTELLATION[date.getMonth() + 1][start];
        const endConstellation = MONTH_CONSTELLATION[date.getMonth() + 1][end];

        if (!startConstellation?.star || !endConstellation?.star) return null;

        const startStar = startConstellation.star;
        const endStar = endConstellation.star;
        const isStartBig = startConstellation.big ?? false;
        const isEndBig = endConstellation.big ?? false;

        const lineProps = calcLineLocation(startStar, endStar, isStartBig, isEndBig);
        return <Line key={index} {...lineProps} />;
      })}
      <ToggleButton
        $toggle={toggle}
        onClick={() => {
          setToggle(prev => !prev);
        }}
      >
        {toggle ? "ON" : "OFF"}
      </ToggleButton>
    </Wrapper>
  );
};

export default Constellation;
