import { useCallback, useEffect, useState } from "react";

import { fetchAchievementRate, fetchFocusTime } from "@/apis/statistics";

interface AchievementRateType {
  name: string;
  rate: number;
}

interface FocusTimeType {
  name: string;
  최대: number;
  최소: number;
}

export const useStatistics = ({ year, month }: { year: number; month: number }) => {
  const [achievementRate, setAchievementRate] = useState<AchievementRateType[]>();
  const [focusTime, setFocusTime] = useState<FocusTimeType[]>();

  const initAchievementRate = useCallback(async () => {
    const stringMonth = month.toString().padStart(2, "0");
    const response = await fetchAchievementRate(`${year}-${stringMonth}`);
    if (Array.isArray(response)) {
      setAchievementRate(
        response.map(value => {
          return {
            name: `${month}월 ${value.weekOfMonth}주`,
            rate: value.rate ?? 0,
          };
        }),
      );
    }
  }, [year, month]);

  const initMonthlyFocusTime = useCallback(async () => {
    const stringMonth = month.toString().padStart(2, "0");
    const response = await fetchFocusTime(`${year}-${stringMonth}`);
    if (Array.isArray(response)) {
      setFocusTime(
        response.map(value => {
          return {
            name: `${month}월 ${value.weekOfMonth}주`,
            최대: Math.round(((value.maxDuration ?? 0) / 3600) * 100) / 100,
            최소: Math.round(((value.minDuration ?? 0) / 3600) * 100) / 100,
          };
        }),
      );
    }
  }, [year, month]);

  useEffect(() => {
    // 월이 변경될 때마다 API 재호출
    void initAchievementRate();
    void initMonthlyFocusTime();
  }, [year, month, initAchievementRate, initMonthlyFocusTime]);

  return {
    focusTime,
    achievementRate,
  };
};
