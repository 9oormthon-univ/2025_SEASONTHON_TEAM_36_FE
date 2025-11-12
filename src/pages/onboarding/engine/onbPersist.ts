// src/pages/home/onboarding/engine/onbPersist.ts
const KEY_PREFIX = "onb.v1"; // 단계/콘텐츠 바뀌면 v2로 올리세요
const DONE_KEY = `${KEY_PREFIX}.done`;

export function getOnbDone(): boolean {
  try {
    return typeof window !== "undefined" && localStorage.getItem(DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOnbDone(): void {
  try {
    localStorage.setItem(DONE_KEY, "1");
  } catch {
    /* private mode 등 예외 무시 */
  }
}

export function resetOnbDone(): void {
  try {
    localStorage.removeItem(DONE_KEY);
  } catch {
    // 예외 무시
  }
}
