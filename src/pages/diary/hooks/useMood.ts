import { useEffect, useState } from "react";

import { fetchDiaryOfMonth } from "@/apis/diary";

import { Mood } from "../types/constellation";

export const useMood = (date: Date) => {
  const [moods, setMoods] = useState<Mood>({});

  useEffect(() => {
    fetchDiaryOfMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`)
      .then(response => {
        if (typeof response === "object" && Array.isArray(response)) {
          const updatedMoods = {} as Mood;
          response.forEach(value => {
            updatedMoods[value.date] = value.mood;
          });
          setMoods(updatedMoods);
        }
      })
      .catch(error => console.error(error));
  }, [date]);

  return moods;
};
