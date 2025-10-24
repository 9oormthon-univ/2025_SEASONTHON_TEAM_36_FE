import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { validateYearMonthString } from "../utils/dateUtils";

export const useDiary = (): [string, (move: number) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 초기 날짜 계산 및 date 상태 관리 (searchParams 기반)
  const [date, setDate] = useState(validateYearMonthString(searchParams.get("yearMonth")));

  useEffect(() => {
    setSearchParams(`?yearMonth=${date}`);
  }, [date, setSearchParams]);

  useEffect(() => {
    // 다이어리 화면에 들어올 때 스크롤 hidden";
    document.body.style.overflow = "hidden";
    document.getElementById("root")!.style.overflow = "hidden";
    // 나갈 때는 다시 복구
    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("root")!.style.overflow = "auto";
    };
  }, []);

  const handleMoveMonth = useCallback(
    (move: number) => {
      const prevDate = new Date(date);
      const prevYear = prevDate.getFullYear();
      const prevMonth = prevDate.getMonth();
      const nextDate = new Date(prevYear, prevMonth + move, 1);
      const nextDateString = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1).toString().padStart(2, "0")}`;
      setDate(nextDateString);
      setSearchParams(`?yearMonth=${nextDateString}`);
    },
    [date, setSearchParams],
  );

  return [date, handleMoveMonth];
};
