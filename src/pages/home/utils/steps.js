// src/pages/home/utils/steps.js
import { isTodayISO, isFutureISO } from "./dates";

/**
 * steps 배열(백엔드 도메인) → UI 섹션 2개(prep/carried)로 변환
 * - 완료(isCompleted) 된 항목 제외
 * - 미래 날짜는 제외(요구사항에 맞춰 nonFuture만)
 * - 각 item은 기본 state="pause" 로 매핑
 */
export function buildBaseGroupsFromSteps(steps = []) {
  const safe = Array.isArray(steps) ? steps : [];
  const pending = safe.filter((s) => s && s.isCompleted === false);
  const nonFuture = pending.filter((s) => !isFutureISO(s.stepDate));

  const toPausedItem = (prefix) => (s, i) => ({
    id: `${prefix}-${s.stepOrder ?? i ?? 0}`,
    title: s.description ?? "",
    state: "pause",
    // 필요하면 원본도 보관 가능: raw: s
  });

  const prep = nonFuture.filter((s) => isTodayISO(s.stepDate)).map(toPausedItem("prep"));
  const carried = nonFuture.filter((s) => !isTodayISO(s.stepDate)).map(toPausedItem("carried"));

  return [
    { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: prep },
    { id: "carried", title: "이월된 일", defaultOpen: true, items: carried },
  ];
}

/** 현재 재생 중인 playingKey를 반영해 state(play/pause) 치환 */
export function applyPlayingState(groups, playingKey) {
  return groups.map((g) => ({
    ...g,
    items: g.items.map((it) => ({
      ...it,
      state: it.id === playingKey ? "play" : "pause",
    })),
  }));
}
