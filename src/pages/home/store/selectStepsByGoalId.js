import stepsMocks from "./steps.mock.json";

/**
 * homeGoals(contents 배열) + goalId로 stepsMocks에서 대응 항목을 찾는다.
 * 1) id로 homeGoals의 goal 찾기 → title 확보
 * 2) title 매칭 우선, 없으면 homeGoals 내 index와 stepsMocks index 정렬
 * 3) 정상화된 응답 스키마 반환
 */
export function selectStepsByGoalId(homeGoalsData, goalId) {
  const contents = homeGoalsData?.contents ?? [];

  // goal 찾기
  const goal = contents.find((g) => String(g.id) === String(goalId)) ?? contents[0] ?? null;
  if (!goal) return null;

  const idx = contents.indexOf(goal);
  // title 우선 매칭 → 실패 시 index 정렬
  let entry = stepsMocks.find((e) => e?.title === goal.title) ?? stepsMocks[idx] ?? null;
  if (!entry) return null;

  return normalizeEntry(entry);
}

function normalizeEntry(e) {
  return {
    dDay: e.dDay ?? "D-0",
    title: e.title ?? "",
    endDate: e.endDate ?? "",
    progressText: e.progressText ?? "",
    progress: Number(e.progress ?? 0),
    steps: Array.isArray(e.steps)
      ? e.steps.map((s, i) => ({
          stepDate: s.stepDate ?? "",
          stepOrder: Number.isFinite(+s.stepOrder) ? +s.stepOrder : i + 1,
          description: s.description ?? "",
          isCompleted: !!s.isCompleted,
        }))
      : [],
  };
}
