import { memo, useEffect } from "react";

import { useSubjectStore } from "../stores/useSubjectStore";
import { Subjects, Wrapper } from "../styles/AchievedGoals";
import GoalInfo from "./GoalInfo";
import Status from "./Status";
import Subject from "./Subject";

const todoTypeKor = ["예습/복습", "수행평가", "시험공부", "진로활동", "취미", "기타"];

// subjects 데이터만 구독하는 별도 컴포넌트
const SubjectContent = memo(({ range }: { range: [number, number] }) => {
  const clickedSubject = useSubjectStore(state => state.clickedSubject);
  const subjects = useSubjectStore(state => state.subjects);

  if (clickedSubject < range[0] || clickedSubject > range[1]) {
    return null;
  }

  if (subjects === null) {
    return <Status title={todoTypeKor[clickedSubject]} description="데이터 가져오는 중..." />;
  }

  if (subjects === undefined) {
    return <Status title={todoTypeKor[clickedSubject]} description="데이터 로드를 실패했습니다" />;
  }

  if (subjects.length === 0) {
    return <Status title={todoTypeKor[clickedSubject]} description="과제 기록이 없습니다" />;
  }

  return <GoalInfo data={subjects} />;
});

const AchievedGoals = ({ year, month }: { year: number; month: number }) => {
  // clickedSubject만 구독 - 이것만 빠르게 업데이트됨
  const clickedSubject = useSubjectStore(state => state.clickedSubject);
  const setYearMonth = useSubjectStore(state => state.setYearMonth);

  // year, month 변경 시 상태 초기화
  useEffect(() => {
    setYearMonth(year, month);
  }, [year, month, setYearMonth]);

  return (
    <Wrapper>
      <Subjects>
        {[0, 1, 2].map(value => (
          <Subject key={value} index={value} focused={value === clickedSubject} />
        ))}
      </Subjects>
      <SubjectContent range={[0, 2]} />
      <Subjects>
        {[3, 4, 5].map(value => (
          <Subject key={value} index={value} focused={value === clickedSubject} />
        ))}
      </Subjects>
      <SubjectContent range={[3, 5]} />
    </Wrapper>
  );
};

export default AchievedGoals;
