import { useStatistics } from "../hooks/useStatistics";
import { Subjects, Wrapper } from "../styles/AchievedGoals";
import GoalInfo from "./GoalInfo";
import Status from "./Status";
import Subject from "./Subject";

const todoTypeKor = ["예습/복습", "수행평가", "시험공부", "진로활동", "취미", "기타"];

const AchievedGoals = () => {
  const { clickedSubject, subjects, handleSubjectNumber } = useStatistics();

  return (
    <Wrapper>
      <Subjects>
        <Subject index={0} subject={clickedSubject} onClick={handleSubjectNumber} />
        <Subject index={1} subject={clickedSubject} onClick={handleSubjectNumber} />
        <Subject index={2} subject={clickedSubject} onClick={handleSubjectNumber} />
      </Subjects>
      {clickedSubject >= 0 &&
        clickedSubject < 3 &&
        (subjects ? (
          subjects.length > 0 ? (
            <GoalInfo data={subjects} />
          ) : (
            <Status title={todoTypeKor[clickedSubject]} description="과제 기록이 없습니다" />
          )
        ) : subjects === null ? (
          <Status title={todoTypeKor[clickedSubject]} description="데이터 가져오는 중..." />
        ) : (
          <Status title={todoTypeKor[clickedSubject]} description="데이터 로드를 실패했습니다" />
        ))}
      <Subjects>
        <Subject index={3} subject={clickedSubject} onClick={handleSubjectNumber} />
        <Subject index={4} subject={clickedSubject} onClick={handleSubjectNumber} />
        <Subject index={5} subject={clickedSubject} onClick={handleSubjectNumber} />
      </Subjects>
      {clickedSubject >= 3 &&
        clickedSubject < 6 &&
        (subjects ? (
          subjects.length > 0 ? (
            <GoalInfo data={subjects} />
          ) : (
            <Status title={todoTypeKor[clickedSubject]} description="과제 기록이 없습니다" />
          )
        ) : subjects === null ? (
          <Status title={todoTypeKor[clickedSubject]} description="데이터 가져오는 중..." />
        ) : (
          <Status title={todoTypeKor[clickedSubject]} description="데이터 로드를 실패했습니다" />
        ))}
    </Wrapper>
  );
};

export default AchievedGoals;
