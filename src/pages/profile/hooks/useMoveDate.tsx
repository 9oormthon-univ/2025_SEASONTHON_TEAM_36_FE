import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useMoveDate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [year, setYear] = useState(Number(searchParams.get("year") ?? new Date().getFullYear()));
  const [month, setMonth] = useState(
    Number(searchParams.get("month") ?? new Date().getMonth() + 1),
  );

  useEffect(() => {
    setSearchParams(prev => {
      prev.set("year", String(year));
      prev.set("month", String(month));
      return prev;
    });
  }, [year, month, setSearchParams]);

  const handleMoveMonth = useCallback(
    (offset: number) => {
      const nextDate = new Date(year, month - 1 + offset);
      setYear(nextDate.getFullYear());
      setMonth(nextDate.getMonth() + 1);
    },
    [month, year, setYear, setMonth],
  );

  return { year, month, handleMoveMonth, setYear, setMonth };
};
