const cheers = [
  "첫 단추만 잘 끼우자.",
  "방향만 잃지 않으면 돼.",
  "사용자를 떠올리면 길이 보여.",
  "배우고 더 잘하자.",
  "조금씩도 충분히 전진이야.",
  "좋은 질문이 좋은 답을 만든다.",
  "현장의 목소리에 귀 기울이자.",
  "퍼즐이 맞춰지고 있어.",
  "복잡함을 단순하게.",
  "거칠어도 시작이 반.",
  "느려도 괜찮아, 계속 가면 결국 도착해.",
  "오늘도 한 걸음!",
  "꾸준함이 이긴다.",
  "시작이 반!",
  "좋아, 거의 다 왔어.",
];
export default cheers;

export const FALLBACK_CHEER = "오늘도 파이팅!";

export function pickRandomCheer(pool = cheers) {
  const arr = Array.isArray(pool) && pool.length ? pool : [FALLBACK_CHEER];
  const r = Math.floor(Math.random() * arr.length);
  return arr[r];
}
