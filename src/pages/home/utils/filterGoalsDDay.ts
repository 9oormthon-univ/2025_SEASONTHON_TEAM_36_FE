/**
 * goals 배열에서 dDay가 D+4 이상이면 제외해주는 필터
 */
import type { RespTodo } from "@/common/types/response/todo";

export function filterGoalsDDay(goals: RespTodo[]): RespTodo[] {
  return goals.filter(g => {
    const d = g.dDay.trim();

    // D+숫자 or D-숫자 or D0 등 다양한 포맷을 정규식으로 파싱
    const match = /^D\s*([+-])?\s*(\d+)?$/i.exec(d);
    if (!match) return true; // 파싱 불가하면 그대로 통과

    const sign = match[1] ?? null; // '+' | '-' | null
    const num = Number(match[2] ?? 0);

    // D-something → 과거/오늘 → 항상 표시
    if (sign === "-" || sign === null) return true;

    // D+숫자 → 미래 날짜 → 숫자가 4 이상이면 숨김
    if (sign === "+" && num >= 4) return false;

    return true;
  });
}
