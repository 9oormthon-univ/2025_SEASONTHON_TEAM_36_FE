import { useCallback, useState } from "react";

import { Subjects, Wrapper } from "../styles/AchievedGoals";
import GoalInfo, { GoalInfoType } from "./GoalInfo";
import NoContent from "./NoContent";
import Subject from "./Subject";

const RawData: Record<string, GoalInfoType[]> = {
  "예습/복습": [
    {
      title: "LG 전자제품 IMC 기획서 작성",
      startDate: "2025-09-01",
      endDate: "2025-09-14",
      time: "06:11:17",
    },
    {
      title: "총균쇠 독후감 작성",
      startDate: "2025-09-03",
      endDate: "2025-09-10",
      time: "03:41:11",
    },
  ],
  수행평가: [],
  시험공부: [],
  진로활동: [],
  취미: [],
  기타: [],
};

const AchievedGoals = () => {
  const [subject, setSubject] = useState<number>(-1);
  const handleSubjectNumber = useCallback(
    (index: number) => {
      if (subject == index) setSubject(-1);
      else setSubject(index);
    },
    [setSubject, subject],
  );
  return (
    <Wrapper>
      <Subjects>
        <Subject index={0} subject={subject} onClick={handleSubjectNumber} />
        <Subject index={1} subject={subject} onClick={handleSubjectNumber} />
        <Subject index={2} subject={subject} onClick={handleSubjectNumber} />
      </Subjects>
      {subject >= 0 &&
        subject < 3 &&
        (RawData[Object.keys(RawData)[subject]].length > 0 ? (
          <GoalInfo data={RawData[Object.keys(RawData)[subject]]} />
        ) : (
          <NoContent title={Object.keys(RawData)[subject]} />
        ))}
      <Subjects>
        <Subject index={3} subject={subject} onClick={handleSubjectNumber} />
        <Subject index={4} subject={subject} onClick={handleSubjectNumber} />
        <Subject index={5} subject={subject} onClick={handleSubjectNumber} />
      </Subjects>
      {subject >= 3 &&
        subject < 6 &&
        (RawData[Object.keys(RawData)[subject]].length > 0 ? (
          <GoalInfo data={RawData[Object.keys(RawData)[subject]]} />
        ) : (
          <NoContent title={Object.keys(RawData)[subject]} />
        ))}
    </Wrapper>
  );
};

export default AchievedGoals;
