// src/pages/home/utils/steps.js
import { isFutureISO,isTodayISO } from "./dates";
/**
 * steps 배열(백엔드 도메인) → UI 섹션 2개(prep/carried)로 변환
 * - 완료(isCompleted) 된 항목 제외
 * - 미래 날짜는 제외(요구사항에 맞춰 nonFuture만)
 * - 각 item은 기본 state="pause" 로 매핑
 */

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
