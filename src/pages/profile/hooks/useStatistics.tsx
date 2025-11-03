import { useCallback, useEffect, useState } from "react";

import { fetchAchievementRate, fetchFocusTime, fetchMonthlyTodos } from "@/apis/statistics";
import { TodoType } from "@/common/types/request/statistics";
import { RespFocusTime, RespMonthlyTodos } from "@/common/types/response/statistics";

import { useMoveDate } from "./useMoveDate";

interface AchievementRateType {
  name: string;
  rate: number;
}

interface FocusTimeType {
  name: string;
  최대: number;
  최소: number;
}

const idx2todoType: TodoType[] = [
  "PREVIEW_REVIEW",
  "HOMEWORK",
  "TEST_STUDY",
  "PERFORMANCE_ASSESSMENT",
  "CAREER_ACTIVITY",
  "ETC",
];

export const useStatistics = () => {
  const { year, month } = useMoveDate();

  const [clickedSubject, setClickedSubject] = useState<number>(-1);
  const [subjects, setSubjects] = useState<RespMonthlyTodos[] | null | undefined>(null);
  const [achievementRate, setAchievementRate] = useState<AchievementRateType[]>();
  const [focusTime, setFocusTime] = useState<FocusTimeType[]>();

  const handleSubjectNumber = useCallback(
    (index: number) => {
      if (clickedSubject == index) {
        setClickedSubject(-1);
        setSubjects(null);
      } else {
        setClickedSubject(index);
        const stringMonth = month.toString().padStart(2, "0");
        fetchMonthlyTodos(`${year}-${stringMonth}`, idx2todoType[index])
          .then(todos => {
            if (Array.isArray(todos)) {
              setSubjects(todos);
            }
          })
          .catch(error => {
            console.error("Failed to fetch monthly todos:", error);
            setSubjects(undefined);
          });
      }
    },
    [clickedSubject, setClickedSubject, year, month],
  );
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
    try {
      void initAchievementRate();
      void initMonthlyFocusTime();
    } catch (error) {
      console.error(error);
    }
  }, [initMonthlyFocusTime, initAchievementRate]);

  return {
    clickedSubject,
    setClickedSubject,
    subjects,
    setSubjects,
    handleSubjectNumber,
    focusTime,
    achievementRate,
  };
};
