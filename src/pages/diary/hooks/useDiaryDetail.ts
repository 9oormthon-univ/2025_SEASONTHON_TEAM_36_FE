import { useCallback, useEffect, useRef, useState } from "react";

import { fetchDiaryDetail } from "@/apis/diary";
import type { ErrorResponse } from "@/common/types/error";
import type { RespDiaryDetail } from "@/common/types/response/diary";

type DiaryDetailResult = RespDiaryDetail | ErrorResponse | string | null;

function isErrorResponse(x: unknown): x is ErrorResponse {
  return !!x && typeof x === "object" && "message" in x && "code" in x;
}

export function useDiaryDetail(date?: string | null) {
  const [detail, setDetail] = useState<RespDiaryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!date);
  const latestDateRef = useRef<string | null>(date ?? null);

  const load = useCallback(async (d = latestDateRef.current) => {
    if (!d) return;
    setLoading(true);
    setError(null);

    try {
      const res: DiaryDetailResult = await fetchDiaryDetail(String(d));

      if (typeof res === "string") {
        setError(res || "알 수 없는 오류가 발생했습니다.");
        setDetail(null);
        return;
      }
      if (isErrorResponse(res)) {
        setError(res.message || "요청에 실패했습니다.");
        setDetail(null);
        return;
      }

      setDetail(res);
    } catch (e) {
      console.error(e);
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // date가 바뀌면 재로딩
  useEffect(() => {
    latestDateRef.current = date ?? null;
    if (!date) {
      setDetail(null);
      setError(null);
      setLoading(false);
      return;
    }
    void load(date);
  }, [date, load]);

  const reload = useCallback(() => {
    void load();
  }, [load]);

  return { detail, error, loading, reload };
}

export default useDiaryDetail;
