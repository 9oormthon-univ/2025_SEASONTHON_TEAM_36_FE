import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import leftBtnDiaryImg from "@/assets/images/left-btn-diary.svg";
import rightBtnDiaryImg from "@/assets/images/right-btn-diary.svg";
import starImg from "@/assets/images/stars/star-0.svg";
import star1Img from "@/assets/images/stars/star-1.svg";
import star2Img from "@/assets/images/stars/star-2.svg";
import star3Img from "@/assets/images/stars/star-3.svg";
import star4Img from "@/assets/images/stars/star-4.svg";
import star5Img from "@/assets/images/stars/star-5.svg";
import star6Img from "@/assets/images/stars/star-6.svg";
import star7Img from "@/assets/images/stars/star-7.svg";
import star8Img from "@/assets/images/stars/star-8.svg";
import star9Img from "@/assets/images/stars/star-9.svg";
import star10Img from "@/assets/images/stars/star-10.svg";

import { dateToFormatString } from "../calendar/utils/dateUtils";
import { AUGUST, NOVEMBER, OCTOBER, SEPTEMBER } from "./constants/constellation";
import { dummy } from "./constants/dummy";

const Screen = styled.div`
  /* Main 영역을 꽉 채우도록 flex 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
  width: 100%;
  height: 100vh;

  background-image: url("/night-sky.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 76px;
  padding: 12px 24px;
`;

const NightSkyOfMonth = styled.div`
  display: flex;
  justify-content: space-around;
  width: 70%;
`;

const ThisMonth = styled.h1`
  color: white;
  font-size: var(--fs-xl);
`;

const Constellation = styled.div`
  position: relative;
  margin-top: 35px;
  width: 352px;
  height: 451px;
`;

const Star = styled.div`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
`;

const Message = styled.h3`
  font-size: var(--fs-md);
  margin-top: 47px;
  color: white;
`;

const ToggleButton = styled.button`
  position: absolute;
  border-radius: 100%;
  background-color: ${props => (props.$toggle ? "white" : "var(--natural-400)")};
  box-shadow: 0px 0px 5px 2px ${props => (props.$toggle ? "var(--natural-400)" : "var(--text-3)")};
  color: ${props => (props.$toggle ? "black" : "var(--text-3)")};
  width: 36px;
  height: 36px;
  font-size: var(--fs-xs);
  bottom: -15px;
  right: 0;
`;

const MONTH = {
  8: AUGUST,
  9: SEPTEMBER,
  10: OCTOBER,
  11: NOVEMBER,
};

const EMOTION_IMG = {
  1: star1Img,
  2: star2Img,
  3: star3Img,
  4: star4Img,
  5: star5Img,
  6: star6Img,
  7: star7Img,
  8: star8Img,
  9: star9Img,
  10: star10Img,
};

export default function Diary() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    // 다이어리 화면에 들어올 때 스크롤 차단
    document.body.style.overflow = "hidden";

    // 나갈 때는 다시 복구
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleMoveMonth = useCallback(
    move => {
      const prevDate = new Date(date);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth();
      const tmp = prevMonth + move;
      const nextYear = tmp < 0 ? prevYear - 1 : tmp >= 12 ? prevYear + 1 : prevYear;
      const nextMonth = tmp < 0 ? 11 : tmp >= 12 ? 0 : tmp;
      setDate(new Date(nextYear, nextMonth, 1));
    },
    [date],
  );

  return (
    <Screen>
      <Header>
        <h1 style={{ color: "white", fontSize: "var(--fs-2xl)" }}>일기</h1>
      </Header>
      <NightSkyOfMonth>
        <button
          onClick={() => {
            handleMoveMonth(-1);
          }}
        >
          <img src={leftBtnDiaryImg} alt="왼쪽 버튼" width="" height="" />
        </button>
        <ThisMonth>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 밤하늘`}</ThisMonth>
        <button
          onClick={() => {
            handleMoveMonth(1);
          }}
        >
          <img src={rightBtnDiaryImg} alt="왼쪽 버튼" width="" height="" />
        </button>
      </NightSkyOfMonth>

      <Constellation>
        {MONTH[date.getMonth() + 1] &&
          Object.keys(MONTH[date.getMonth() + 1]).map((day, index) => {
            const constellation = MONTH[date.getMonth() + 1][day];
            const dateString = dateToFormatString(
              new Date(date.getFullYear(), date.getMonth(), day),
            );
            const diaryInfo = dummy[dateString];
            const image = diaryInfo ? EMOTION_IMG[diaryInfo.emotion] : starImg;
            return (
              <Star
                key={index}
                $x={constellation.star.x}
                $y={constellation.star.y}
                onClick={() => {
                  diaryInfo
                    ? navigate(`/diary/${diaryInfo.id}`, { state: diaryInfo })
                    : navigate("/diary/writing", { state: dateString });
                }}
              >
                <img
                  src={image}
                  alt="별"
                  width={constellation.big ? 34.2 : 16}
                  height={constellation.big ? 34.2 : 16}
                />
                <span
                  style={{
                    color: "white",
                    fontSize: "var(--fs-xs)",
                    display: toggle ? "block" : "none",
                    position: "absolute",
                    top: `${constellation.text?.y ?? 0}px`,
                    left: `${constellation.text?.x ?? 0}px`,
                  }}
                >
                  {day}
                </span>
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
      </Constellation>
      <Message>{"개구리가 우물 안에서 볼 밤하늘을 밝혀주세요"}</Message>
    </Screen>
  );
}
