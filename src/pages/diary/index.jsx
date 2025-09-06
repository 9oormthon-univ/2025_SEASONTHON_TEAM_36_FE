import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import leftBtnDiaryImg from "@/assets/images/left-btn-diary.svg";
import rightBtnDiaryImg from "@/assets/images/right-btn-diary.svg";
import starImg from "@/assets/images/stars/star-0.svg";

import { AUGUST, NOVEMBER, OCTOBER, SEPTEMBER } from "./constants/constellation";

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
  width: 352px;
  height: 451px;
`;

const MONTH = {
  8: AUGUST,
  9: SEPTEMBER,
  10: OCTOBER,
  11: NOVEMBER,
};

export default function Diary() {
  const [date, setDate] = useState(new Date());
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
          Object.keys(MONTH[date.getMonth() + 1]).map(day => {
            <img
              src={starImg}
              alt="별"
              width={MONTH[date.getMonth() + 1][day].big ? "34.2" : "16"}
              height={MONTH[date.getMonth() + 1][day].big ? "34.2" : "16"}
            />;
          })}
      </Constellation>
    </Screen>
  );
}
