// src/pages/home/hooks/useFetchTodos.ts
import { useCallback, useEffect, useState } from "react";

import { fetchTodos } from "@/apis/todo";
import { RespAllTodo, RespTodo } from "@/common/types/response/todo";

export interface UseFetchTodosResult {
  goals: RespTodo[];
  loading: boolean;
  error: unknown;
  reloadTodos: () => Promise<void>;
}

export function useFetchTodos(): UseFetchTodosResult {
  const [goals, setGoals] = useState<RespTodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const fetchAndSet = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await fetchTodos()) as RespAllTodo | null;
      const contents = Array.isArray(res?.contents) ? res.contents : [];
      setGoals(contents);
      setError(null);
    } catch (e) {
      console.error("할 일 목록 로딩 실패:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        setLoading(true);
        const res = (await fetchTodos()) as RespAllTodo | null;
        if (!alive) return;
        const list = Array.isArray(res?.contents) ? res.contents : [];
        setGoals(list);
        setError(null);
      } catch (e) {
        if (!alive) return;
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const reloadTodos = useCallback(async () => {
    await fetchAndSet();
  }, [fetchAndSet]);

  return { goals, loading, error, reloadTodos };
}
