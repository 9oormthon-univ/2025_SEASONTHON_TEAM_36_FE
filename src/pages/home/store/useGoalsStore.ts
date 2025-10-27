import { useEffect } from "react";
import { create } from "zustand";

import type { RespTodo } from "@/common/types/response/todo";

import { useFetchTodos } from "../hooks/useFetchTodos";

/** ====== 개발용 더미 데이터 ====== */
const DUMMY_GOALS: RespTodo[] = [
  {
    id: 101,
    userId: 1,
    currentDate: "2025-10-22",
    dDay: "D-5",
    title: "React 공부하기",
    warmMessage: "꾸준히 하면 분명 성장할 거예요!",
    progress: 45,
    isCompleted: false,
  },
  {
    id: 102,
    userId: 1,
    currentDate: "2025-10-22",
    dDay: "D-10",
    title: "운동 루틴 만들기",
    warmMessage: "오늘도 한 발짝 나아가요 💪",
    progress: 60,
    isCompleted: false,
  },
];

/** ====== Zustand Store Shape ====== */
interface GoalsState {
  goals: RespTodo[]; // 항상 배열
  loading: boolean;
  error: unknown;

  setGoals: (gs: RespTodo[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: unknown) => void;

  reloadTodos: () => Promise<void>;
  setReloader: (fn: () => Promise<void>) => void;
}

/** ====== Store 정의 ====== */
export const useGoalsStore = create<GoalsState>(set => ({
  goals: [],
  loading: false,
  error: null,

  setGoals: gs => set({ goals: gs }),
  setLoading: v => set({ loading: v }),
  setError: e => set({ error: e }),

  reloadTodos: async () => {},
  setReloader: fn => set({ reloadTodos: fn }),
}));

/**
 * ====== 바인딩 훅 ======
 * useFetchTodos 의 결과를 Zustand store 에 동기화.
 * 호출 실패 또는 빈 데이터 시 DUMMY_GOALS 를 자동 세팅 (개발용 fallback)
 */
export function useBindGoalsStore() {
  const { goals, loading, error, reloadTodos } = useFetchTodos();

  const setGoals = useGoalsStore(s => s.setGoals);
  const setLoading = useGoalsStore(s => s.setLoading);
  const setError = useGoalsStore(s => s.setError);
  const setReloader = useGoalsStore(s => s.setReloader);

  /** ====== goals 변경 시 ====== */
  useEffect(() => {
    // API 실패나 빈 배열 시 개발용 더미로 대체
    if ((!goals || goals.length === 0) && !loading) {
      console.warn("[useGoalsStore] 서버 응답 없음 → 더미 데이터 사용");
      if (import.meta.env.DEV && (!goals || goals.length === 0)) {
        setGoals(DUMMY_GOALS);
      }
    } else {
      setGoals(goals);
    }
  }, [goals, loading, setGoals]);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  useEffect(() => {
    setReloader(reloadTodos);
  }, [reloadTodos, setReloader]);

  return { goals, loading, error, reloadTodos };
}
