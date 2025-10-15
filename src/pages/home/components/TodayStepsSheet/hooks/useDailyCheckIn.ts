// src/pages/home/components/hooks/useDailyCheckIn.ts

import { useCallback, useEffect, useState } from "react";

import { todayKey } from "../../../utils/dates";

const STORAGE_KEY_PREFIX = "daily-checkin-shown:";

// 로컬 스토리지 관리 헬퍼 함수
export function getDailyShown() {
  try {
    const key = STORAGE_KEY_PREFIX + todayKey();
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function markDailyShown() {
  try {
    const key = STORAGE_KEY_PREFIX + todayKey();
    localStorage.setItem(key, "1");
  } catch {
    return false;
  }
}

// 커스텀 훅
export function useDailyCheckIn() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dailyShown, setDailyShown] = useState(false);

  useEffect(() => {
    setDailyShown(getDailyShown());
  }, []);

  const maybeOpen = useCallback(() => {
    if (!dailyShown) setModalOpen(true);
  }, [dailyShown]);

  const closeAndMark = useCallback(() => {
    setModalOpen(false);
    markDailyShown();
    setDailyShown(true);
  }, []);

  return { modalOpen, dailyShown, maybeOpen, closeAndMark };
}
