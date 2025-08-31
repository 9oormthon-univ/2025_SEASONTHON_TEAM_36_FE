import Calendar from 'react-calendar';

const CustomCalendar = () => {
  // 현재 주의 시작일과 끝일 계산 (월요일 시작, 일요일 끝)
  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = 일요일, 1 = 월요일, ...

    // 월요일을 주의 시작으로 계산
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // 일요일이면 6, 나머지는 currentDay - 1

    // 이번 주 시작 (월요일)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);

    // 이번 주 끝 (일요일)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getCurrentWeekRange();

  // 이번 주가 아닌 날짜들을 비활성화
  const tileDisabled = ({ activeStartDate, date, view }) => {
    if (view !== 'month') return false;

    return date < weekStart || date > weekEnd;
  };

  // 날짜를 "1", "2", ... 형태로 포맷팅
  const formatDay = (locale, date) => {
    return date.getDate().toString(); // "1일" → "1"
  };
  // 각 날짜 위에 div 요소 추가
  const getTileContent = ({ activeStartDate, date, view }) => {
    // 월 보기일 때만 div 추가
    if (view === 'month') {
      return (
        <div
          style={{
            width: '23px',
            height: '23px',
            border: '1px solid var(--natural-400)',
            borderRadius: '4px',
            marginBottom: '2px',
          }}
        ></div>
      );
    }
    return null;
  };

  return (
    <Calendar
      formatDay={formatDay}
      tileContent={getTileContent}
      // tileDisabled={tileDisabled}
    />
  );
};

export default CustomCalendar;
