import { useCallback, useState } from "react";

import careerActivities from "@/assets/images/career-activities.svg";
import examStudy from "@/assets/images/exam-study.svg";
import hobbies from "@/assets/images/hobbies.svg";
import others from "@/assets/images/others.svg";
import performanceAssessment from "@/assets/images/performance-assessment.svg";
import previewReview from "@/assets/images/preview-review.svg";

import { Title } from "../styles";
import { Icon, Subject, Subjects, Wrapper } from "../styles/AchevedGoals";
import GoalInfo, { GoalInfoType } from "./GoalInfo";
import NoContent from "./NoContent";

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
        <Subject onClick={() => handleSubjectNumber(0)}>
          <Icon>
            <img src={previewReview} alt="예습/복습" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            예습/복습
          </Title>
        </Subject>
        <Subject onClick={() => handleSubjectNumber(1)}>
          <Icon>
            <img src={performanceAssessment} alt="수행평가" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            수행평가
          </Title>
        </Subject>
        <Subject onClick={() => handleSubjectNumber(2)}>
          <Icon>
            <img src={examStudy} alt="시험공부" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            시험공부
          </Title>
        </Subject>
      </Subjects>
      {subject >= 0 &&
        subject < 3 &&
        (RawData[Object.keys(RawData)[subject]].length > 0 ? (
          <GoalInfo data={RawData[Object.keys(RawData)[subject]]} />
        ) : (
          <NoContent title={Object.keys(RawData)[subject]} />
        ))}
      <Subjects>
        <Subject onClick={() => handleSubjectNumber(3)}>
          <Icon>
            <img src={careerActivities} alt="진로활동" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            진로활동
          </Title>
        </Subject>
        <Subject onClick={() => handleSubjectNumber(4)}>
          <Icon>
            <img src={hobbies} alt="취미" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            취미
          </Title>
        </Subject>
        <Subject onClick={() => handleSubjectNumber(5)}>
          <Icon>
            <img src={others} alt="기타" />
          </Icon>
          <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
            기타
          </Title>
        </Subject>
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
