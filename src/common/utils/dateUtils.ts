export const dateToFormatString = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

export const maxDayOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return 28 + Number(isLeapYear);
  }
};

export const getWeekRange = (date: Date) => {
  // 입력된 날짜 객체 복사 (원본 불변)
  const targetDate = new Date(date);

  // 현재 요일 (0=일요일, 1=월요일, ... 6=토요일)
  const day = targetDate.getDay();

  // 이번 주의 월요일 구하기
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - ((day + 6) % 7));

  // 이번 주의 일요일 구하기
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
};

export const checkWeekPosition = (date: Date) => {
  const { monday, sunday } = getWeekRange(date);

  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = 1월

  // 이번 달의 첫날과 마지막날
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let position = 0;

  if (monday <= firstDayOfMonth && sunday >= firstDayOfMonth) {
    position = -1;
  } else if (monday <= lastDayOfMonth && sunday >= lastDayOfMonth) {
    position = 1;
  }

  return {
    monday,
    sunday,
    position,
  };
};

const LAUNCHING_YEAR = 2025;
const LAUNCHING_MONTH = 8;

/** 날짜 문자열 포맷 (fallback) */
export const formatKoreanDate = (d: Date = new Date()) => {
  const w = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${w}`;
};

/** 검사 대상 날짜가 이번 달이거나 다음 달을 넘어가는지 체크 */
export const checkOverDate = (date: Date) => {
  const curDate = new Date();
  const limitDate = new Date(curDate.getFullYear(), curDate.getMonth());
  return date >= limitDate;
};

export const checkLuanchingDate = (date: Date) => {
  const launchingDate = new Date(LAUNCHING_YEAR, LAUNCHING_MONTH - 1);
  return date <= launchingDate;
};

export const getCorrectDate = (year: number, month: number) => {
  return checkOverDate(new Date(year, month))
    ? new Date()
    : checkLuanchingDate(new Date(year, month))
      ? new Date(LAUNCHING_YEAR, LAUNCHING_MONTH - 1)
      : new Date(year, month);
};

export const validateYearString = (year: string | null) => {
  const yearNum = Number(year);
  if (year === null || Number.isNaN(yearNum) || yearNum < LAUNCHING_YEAR || yearNum > 2025)
    return new Date().getFullYear();
  return yearNum;
};

export const validateMonthString = (month: string | null) => {
  const monthNum = Number(month);
  if (month === null || Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12)
    return new Date().getMonth();
  return monthNum - 1;
};

export const validateYearMonthString = (yearMonth: string | null) => {
  // yyyy-MM 형식 정규표현식 (yyyy: 4자리 숫자, MM: 1-12 또는 01-12)
  const yearMonthRegex = /^(\d{4})-(0?[1-9]|1[0-2])$/;

  if (yearMonth === null || !yearMonthRegex.test(yearMonth)) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const [, year, month] = yearMonth.match(yearMonthRegex)!;
  const paddedMonth = month.padStart(2, "0");

  return `${year}-${paddedMonth}`;
};
