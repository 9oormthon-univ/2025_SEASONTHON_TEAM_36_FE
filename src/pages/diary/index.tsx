import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Constellation from "./components/Constellation";
import DateNavigation from "./components/DateNavigation";
import { Header, Message, Page, Title } from "./styles";
import { getCorrectDate, validateMonthString, validateYearString } from "./utils/dateUtils";

export default function Diary() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 초기 날짜 계산 및 date 상태 관리 (searchParams 기반)
  const [date, setDate] = useState(() => {
    const year = validateYearString(searchParams.get("year"));
    const month = validateMonthString(searchParams.get("month"));
    return getCorrectDate(year, month);
  });

  // searchParams가 변경될 때 date도 업데이트
  useEffect(() => {
    const year = validateYearString(searchParams.get("year"));
    const month = validateMonthString(searchParams.get("month"));
    const nextDate = getCorrectDate(year, month);
    setSearchParams({
      year: nextDate.getFullYear().toString(),
      month: (nextDate.getMonth() + 1).toString(),
    });
    setDate(nextDate);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // 다이어리 화면에 들어올 때 스크롤idden";
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
      setSearchParams({
        year: nextYear.toString(),
        month: (nextMonth + 1).toString(),
      });
    },
    [date, setSearchParams],
  );

  return (
    <Page>
      <Header>
        <Title>일기</Title>
      </Header>
      <DateNavigation handleMoveMonth={handleMoveMonth} date={date} />
      <Constellation date={date} />
      <Message>{"개구리가 우물 안에서 볼 밤하늘을 밝혀주세요"}</Message>
    </Page>
  );
}
