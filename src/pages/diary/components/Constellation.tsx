import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import starImg from "@/assets/images/stars/star-0.svg";

import { dateToFormatString } from "../../calendar/utils/dateUtils";
import { EMOTION_IMG } from "../constants/emotion_img";
import { LINES } from "../constants/line";
import { MONTH_CONSTELLATION } from "../constants/month";
import { useMood } from "../hooks/useMood";
import { Day, Line, Star, StarImg, ToggleButton, Wrapper } from "../styles/Constellation";
import { createLineProps } from "../utils/createLineProps";

const Constellation = ({ date }: { date: Date }) => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState<boolean>(false);
  const moods = useMood(date);

  const handleStarClick = useCallback(
    (diaryInfo: string | undefined, dateString: string) => {
      void (diaryInfo
        ? navigate(`/diary/${dateString}`, { state: dateString })
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
          const mood = moods[dateString];
          const image: string = mood ? EMOTION_IMG[mood] : starImg;

          return (
            <Star
              key={index}
              $x={constellation.star.x}
              $y={constellation.star.y}
              onClick={() => {
                handleStarClick(mood, dateString);
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

        const lineProps = createLineProps(startStar, endStar, isStartBig, isEndBig);
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
