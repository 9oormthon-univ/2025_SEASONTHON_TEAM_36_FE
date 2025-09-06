import frog1 from "@/assets/images/frog-1.svg";
import frog3 from "@/assets/images/frog-complete.svg";
import frog6 from "@/assets/images/frog-escape.svg";
import frog11 from "@/assets/images/frog-escape-new.svg";
import frog10 from "@/assets/images/frog-excited.svg";
import frog9 from "@/assets/images/frog-fight.svg";
import frog7 from "@/assets/images/frog-flower.svg";
import frog2 from "@/assets/images/frog-glasses.svg";
import frog5 from "@/assets/images/frog-running-start.svg";
import frog8 from "@/assets/images/frog-sun.svg";
import frog4 from "@/assets/images/frog-swim.svg";

// 사용 가능한 개구리 이미지 목록
const frogs = [frog1, frog2, frog3, frog4, frog5, frog6, frog7, frog8, frog9, frog10, frog11];
export default frogs;

// 폴백 이미지
export const FALLBACK_FROG = frog1;

// 랜덤 선택 헬퍼
export function pickRandomFrog() {
  const pool = Array.isArray(frogs) && frogs.length ? frogs : [FALLBACK_FROG];
  const r = Math.floor(Math.random() * pool.length);
  return pool[r];
}
