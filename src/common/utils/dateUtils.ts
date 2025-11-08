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
