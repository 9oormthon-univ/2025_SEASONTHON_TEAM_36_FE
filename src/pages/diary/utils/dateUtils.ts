/** 날짜 문자열 포맷 (fallback) */
export const formatKoreanDate = (d: Date = new Date()) => {
  const w = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${w}`;
};
