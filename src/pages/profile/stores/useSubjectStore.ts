import { create } from "zustand";

import { fetchMonthlyTodos } from "@/apis/statistics";
import { Todo } from "@/common/types/enums";
import { RespMonthlyTodos } from "@/common/types/response/statistics";

const idx2todoType: Todo[] = [
  "PREVIEW_REVIEW",
  "PERFORMANCE_ASSESSMENT",
  "TEST_STUDY",
  "CAREER_ACTIVITY",
  "HOMEWORK",
  "ETC",
];

interface SubjectState {
  clickedSubject: number;
  subjects: RespMonthlyTodos[] | null | undefined;
  year: number;
  month: number;

  // 액션들
  setClickedSubject: (index: number) => void;
  fetchSubjects: (index: number, year: number, month: number) => Promise<void>;
  reset: () => void;
  setYearMonth: (year: number, month: number) => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  clickedSubject: -1,
  subjects: null,
  year: 0,
  month: 0,

  setClickedSubject: index => {
    const current = get().clickedSubject;
    const { year, month } = get();

    if (current === index) {
      // 토글: 닫기
      set({ clickedSubject: -1, subjects: null });
    } else {
      // 즉시 UI 업데이트 (낙관적 업데이트)
      set({ clickedSubject: index, subjects: null });
      // 비동기로 데이터 페칭
      void get().fetchSubjects(index, year, month);
    }
  },

  fetchSubjects: async (index, year, month) => {
    try {
      // 이미 clickedSubject가 설정되어 있으므로 바로 데이터만 가져옴
      const stringMonth = month.toString().padStart(2, "0");
      const todos = await fetchMonthlyTodos(`${year}-${stringMonth}`, idx2todoType[index]);

      // 현재 선택된 과목이 여전히 같은지 확인 (사용자가 빠르게 다른 과목을 클릭한 경우 방지)
      if (get().clickedSubject === index) {
        if (Array.isArray(todos)) {
          set({ subjects: todos });
        }
      }
    } catch (error) {
      console.error("Failed to fetch monthly todos:", error);
      // 에러 시에도 현재 선택된 과목이 같은지 확인
      if (get().clickedSubject === index) {
        set({ subjects: undefined });
      }
    }
  },

  reset: () => set({ clickedSubject: -1, subjects: null }),

  setYearMonth: (year, month) => {
    set({ year, month, clickedSubject: -1, subjects: null });
  },
}));
