import { create } from "zustand";

import type { RespTodoSteps } from "@/common/types/response/step";

/** ====== 개발용 Fallback (더미) 데이터 ====== */
const DUMMY_STEPS: Record<number, RespTodoSteps> = {
  101: {
    dDay: "D-5",
    title: "React 공부하기",
    endDate: "2025-10-27",
    progressText: "개구리가 햇빛을 보기 시작했어요!",
    progress: 45,
    steps: [
      {
        todoId: 101,
        todoTitle: "React 공부하기",
        stepId: 1,
        stepDate: "2025-10-20",
        description: "Hooks 복습하기",
        isCompleted: false,
      },
      {
        todoId: 101,
        todoTitle: "React 공부하기",
        stepId: 2,
        stepDate: "2025-10-20",
        description: "Zustand 상태 관리 연습하기",
        isCompleted: false,
      },
      {
        todoId: 101,
        todoTitle: "React 공부하기",
        stepId: 3,
        stepDate: "2025-10-24",
        description: "Context API 정리",
        isCompleted: false,
      },
    ],
  },
  102: {
    dDay: "D-2",
    title: "운동 루틴 만들기",
    endDate: "2025-10-24",
    progressText: "개구리가 햇빛을 보기 시작했어요!",
    progress: 70,
    steps: [
      {
        todoId: 102,
        todoTitle: "운동 루틴 만들기",
        stepId: 1,
        stepDate: "2025-10-21",
        description: "스트레칭 정리",
        isCompleted: false,
      },
      {
        todoId: 102,
        todoTitle: "운동 루틴 만들기",
        stepId: 2,
        stepDate: "2025-10-22",
        description: "상체 루틴 설계",
        isCompleted: false,
      },
      {
        todoId: 102,
        todoTitle: "운동 루틴 만들기",
        stepId: 3,
        stepDate: "2025-10-22",
        description: "하체 루틴 추가",
        isCompleted: false,
      },
    ],
  },
};

/** ====== Zustand Store Shape ====== */
interface StepsState {
  raw: RespTodoSteps | null;
  loading: boolean;
  error: unknown;

  // 내부 setter
  setRaw: (v: RespTodoSteps | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: unknown) => void;

  // 외부 리로더 (useFetchSteps에서 주입)
  reloadSteps: (goalId?: number | null) => Promise<void>;
  setReloader: (fn: (goalId?: number | null) => Promise<void>) => void;

  // API 결과를 받아서 스토어 상태로 반영 (폴백 포함)
  ingestApiResult: (params: {
    goalId?: number | null;
    raw: RespTodoSteps | null;
    loading: boolean;
    error: unknown;
  }) => void;
}

/** ====== Store 정의 ====== */
export const useStepsStore = create<StepsState>(set => ({
  raw: null,
  loading: false,
  error: null,

  setRaw: v => set({ raw: v }),
  setLoading: v => set({ loading: v }),
  setError: e => set({ error: e }),

  reloadSteps: async () => {},
  setReloader: fn => set({ reloadSteps: fn }),

  /** ====== API 결과 반영 + Fallback ====== */
  ingestApiResult: ({ goalId, raw, loading, error }) =>
    set(prev => {
      const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
      let nextRaw = raw;
      let nextError = error;

      // ⚙️ 폴백 조건: dev 환경 + 로딩 완료 + 에러 발생 or 데이터 없음
      if (isDev && !loading && (error || !raw) && goalId != null && DUMMY_STEPS[goalId]) {
        console.warn(`[useStepsStore] ${goalId} fetch 실패 → DUMMY_STEPS 적용`);
        nextRaw = DUMMY_STEPS[goalId];
        nextError = null;
      }

      return {
        ...prev,
        raw: nextRaw,
        error: nextError,
        loading,
      };
    }),
}));
