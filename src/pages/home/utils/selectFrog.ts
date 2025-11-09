import frogCareer from "@/assets/images/todoTypes/frog-career.svg"; // 교체 완료
import frogEtc from "@/assets/images/todoTypes/frog-etc.svg";
import frogHomework from "@/assets/images/todoTypes/frog-hobby.svg";
import frogPerformance from "@/assets/images/todoTypes/frog-performance.svg";
import frogPreview from "@/assets/images/todoTypes/frog-preview.svg";
import frogTestStudy from "@/assets/images/todoTypes/frog-test-study.svg";
import { Todo } from "@/common/types/enums";

const FROG_BY_TODO_TYPE: Record<Todo, string> = {
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
export function getFrogByTodoType(todoType?: Todo | null): string {
  if (!todoType) return FALLBACK_FROG;
  return FROG_BY_TODO_TYPE[todoType] || FALLBACK_FROG;
}
