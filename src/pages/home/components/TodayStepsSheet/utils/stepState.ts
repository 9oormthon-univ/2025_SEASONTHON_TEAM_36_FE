// src/pages/home/utils/stepState.ts

import { PlayingKey, StepListGroup, StepListItem } from "../../../types/steps";

/**
 * 현재 재생 중인 항목과 직전에 정지한 항목을 반영해
 * state(play/pause/idle)를 설정합니다.
 *
 * - playingKey: 현재 재생 중인 step id
 * - lastPlayedKey: 바로 직전까지 재생했던 step id
 */
export function applyPlayingState(
  groups: StepListGroup[],
  playingKey: PlayingKey,
  lastPlayedKey: PlayingKey | null, // ✅ 추가
): StepListGroup[] {
  const isPlaying = (id: string | number, key: PlayingKey) =>
    key !== null && (id === key || String(id) === String(key));

  const isLastPlayed = (id: string | number, key: PlayingKey | null) =>
    key !== null && (id === key || String(id) === String(key));

  return groups.map(g => ({
    ...g,
    items: g.items.map((it): StepListItem => {
      if (isPlaying(it.id, playingKey)) {
        return { ...it, state: "play" }; // 현재 재생 중
      }
      if (isLastPlayed(it.id, lastPlayedKey)) {
        return { ...it, state: "pause" }; // ✅ 마지막에 정지된 항목
      }
      return { ...it, state: "idle" }; // 나머지는 기본 상태
    }),
  }));
}
