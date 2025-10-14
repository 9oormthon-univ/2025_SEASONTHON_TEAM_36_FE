import { useCallback, useEffect, useState } from "react";

import Constellation from "./components/Constellation";
import NightSky from "./components/NightSky";
import { Header, Message, Page, Title } from "./styles";

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
    (move: number) => {
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
    <Page>
      <Header>
        <Title>일기</Title>
      </Header>
      <NightSky handleMoveMonth={handleMoveMonth} date={date} />
      <Constellation date={date} />
      <Message>{"개구리가 우물 안에서 볼 밤하늘을 밝혀주세요"}</Message>
    </Page>
  );
}
