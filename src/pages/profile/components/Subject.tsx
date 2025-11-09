import { memo, useCallback } from "react";

import CareerActivities from "@/assets/images/career-activities.svg?react";
import ExamStudy from "@/assets/images/exam-study.svg?react";
import Hobbies from "@/assets/images/hobbies.svg?react";
import Others from "@/assets/images/others.svg?react";
import PerformanceAssessment from "@/assets/images/performance-assessment.svg?react";
import PreviewReview from "@/assets/images/preview-review.svg?react";

import { useSubjectStore } from "../stores/useSubjectStore";
import { Title } from "../styles";
import { Icon, Wrapper } from "../styles/Subject";

const subjectInfo = [
  {
    SVG: PreviewReview,
    title: "예습/복습",
  },
  {
    SVG: PerformanceAssessment,
    title: "수행평가",
  },
  {
    SVG: ExamStudy,
    title: "시험공부",
  },
  {
    SVG: CareerActivities,
    title: "진로활동",
  },
  {
    SVG: Hobbies,
    title: "취미",
  },
  {
    SVG: Others,
    title: "기타",
  },
];

const Subject = memo(({ index, focused }: { index: number; focused: boolean }) => {
  const SVG = subjectInfo[index].SVG;
  const setClickedSubject = useSubjectStore(state => state.setClickedSubject);

  const handleClick = useCallback(() => {
    setClickedSubject(index);
  }, [index, setClickedSubject]);

  return (
    <Wrapper
      onClick={handleClick}
      onTouchEnd={e => {
        e.preventDefault();
        handleClick();
      }}
      role="button"
      tabIndex={0}
    >
      <Icon>
        <SVG className={focused ? "clicked" : ""} />
      </Icon>
      <Title $fontSize={"var(--fs-sm)"} $fontWeight={400}>
        {subjectInfo[index].title}
      </Title>
    </Wrapper>
  );
});

Subject.displayName = "Subject";

export default Subject;
