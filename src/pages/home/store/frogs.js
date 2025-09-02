import frog1 from "@/assets/images/frog-1.svg";
import frog2 from "@/assets/images/frog-2.svg";

// 사용 가능한 개구리 이미지 목록
const frogs = [frog1, frog2];
export default frogs; 


// 폴백 이미지
export const FALLBACK_FROG = frog1;

// 랜덤 선택 헬퍼
export function pickRandomFrog() {
  const pool = Array.isArray(frogs) && frogs.length ? frogs : [FALLBACK_FROG];
  const r = Math.floor(Math.random() * pool.length);
  return pool[r];
}
