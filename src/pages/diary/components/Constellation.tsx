import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import starImg from "@/assets/images/stars/star-0.svg";

import { dateToFormatString } from "../../calendar/utils/dateUtils";
import { dummy } from "../constants/dummy";
import { EMOTION_IMG } from "../constants/emotion_img";
import { MONTH_CONSTELLATION } from "../constants/month";
import { Day, Star, ToggleButton, Wrapper } from "../styles/Constellation";
import type { Diary } from "../types/Diary";

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
              <img
                src={image}
                alt="별"
                width={constellation.big ? 34.2 : 16}
                height={constellation.big ? 34.2 : 16}
              />
              <Day $toggle={toggle} $x={constellation.text?.x ?? 0} $y={constellation.text?.y ?? 0}>
                {day}
              </Day>
            </Star>
          );
        })}
      <ToggleButton
        $toggle={toggle}
        onClick={() => {
          setToggle(prev => !prev);
        }}
      >
        {toggle ? "ON" : "OFF"}
      </ToggleButton>
      ;
    </Wrapper>
  );
};

export default Constellation;
