import frogCareer from "@/assets/images/frog-default.svg"; // 추후 carrer로 교체
import frogEtc from "@/assets/images/todoTypes/frog-etc.svg";
import frogHomework from "@/assets/images/todoTypes/frog-hobby.svg";
import frogPerformance from "@/assets/images/todoTypes/frog-performance.svg";
import frogPreview from "@/assets/images/todoTypes/frog-preview.svg";
import frogTestStudy from "@/assets/images/todoTypes/frog-test-study.svg";
import { TodoType } from "@/common/types/response/todo";

const FROG_BY_TODO_TYPE: Record<TodoType, string> = {
  PREVIEW_REVIEW: frogPreview,
  HOMEWORK: frogHomework,
  TEST_STUDY: frogTestStudy,
  PERFORMANCE_ASSESSMENT: frogPerformance,
  CAREER_ACTIVITY: frogCareer,
  ETC: frogEtc,
};

// === 폴백 이미지 ===
export const FALLBACK_FROG = frogEtc;

// === 매핑 함수 ===
export function getFrogByTodoType(todoType?: TodoType | null): string {
  if (!todoType) return FALLBACK_FROG;
  return FROG_BY_TODO_TYPE[todoType] || FALLBACK_FROG;
}
