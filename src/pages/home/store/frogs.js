import frogDefault from "@/assets/images/frog-default.svg";
import frogGlasses from "@/assets/images/frog-glasses.svg";

// 사용 가능한 개구리 이미지 목록
const frogs = [frogDefault, frogGlasses];
export default frogs; 


// 폴백 이미지
export const FALLBACK_FROG = frogDefault;

// 랜덤 선택 헬퍼
export function pickRandomFrog() {
  const pool = Array.isArray(frogs) && frogs.length ? frogs : [FALLBACK_FROG];
  const r = Math.floor(Math.random() * pool.length);
  return pool[r];
}
