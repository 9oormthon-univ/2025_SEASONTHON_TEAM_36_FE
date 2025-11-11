// src/pages/home/components/hooks/useDailyCheckIn.ts
import { useCallback, useEffect, useState } from "react";

import { getTodayDailyLogBefore } from "@/apis/diaryLog";
import { RespDailyLogBefore } from "@/common/types/response/dailyLog";

// import { getTodayDailyLogBefore } from "@/apis/dailyLogBefore";

/**
 * 오늘 DailyLogBefore 존재 여부를 서버에서 확인하는 훅
 */
export function useDailyCheckIn() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dailyShown, setDailyShown] = useState<boolean | null>(null);
  // null: 아직 확인 중 / true: 이미 존재함 / false: 존재하지 않음

  /** 서버에서 오늘의 DailyLogBefore 확인 */
  useEffect(() => {
    async function fetchDaily() {
      try {
        const resp = (await getTodayDailyLogBefore()) as RespDailyLogBefore;
        const date = resp?.createdAt;

        // 성공적으로 조회됐다면 이미 기록이 있음
        if (date) {
          setDailyShown(true);
        } else {
          // 데이터 없음 → 아직 작성 전
          setDailyShown(false);
        }
      } catch (err) {
        console.error("오늘의 DailyLogBefore 확인 실패:", err);
        // 실패 시에는 보수적으로 false 취급 (모달 띄움)
        setDailyShown(false);
      }
    }

    void fetchDaily();
  }, []);

  /** 아직 기록 없으면 모달 열기 */
  const maybeOpen = useCallback(() => {
    if (dailyShown === false) {
      setModalOpen(true);
    }
  }, [dailyShown]);

  /** 모달 닫기 (이제 localStorage 대신 state만) */
  const closeAndMark = useCallback(() => {
    setModalOpen(false);
    setDailyShown(true);
  }, []);

  return { modalOpen, dailyShown, maybeOpen, closeAndMark };
}
