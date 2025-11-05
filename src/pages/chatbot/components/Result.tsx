import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModifyImg from "@/assets/images/modify-result.svg";
import ConfirmModal from "@/common/components/ConfirmModal";
import GreenButton from "@/common/components/GreenButton";
import { ModalHeader } from "@/common/components/PageModal";

import { Title } from "../styles";
import {
  Day,
  Days,
  GreenButtonWrapper,
  MeasureText,
  Modify,
  Page,
  SubjectType,
  SubjectTypes,
  TitleInput,
  TitleWrapper,
  TodoDate,
  TodoList,
  TodoTitle,
  Wrapper,
} from "../styles/Result";
import StepComponent from "./Step";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const types = ["예습/복습", "숙제", "시험공부", "수행평가", "진로활동", "기타"];

const Result = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("박태웅의 AI 특강 독후감");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [titleModify, setTitleModify] = useState<boolean>(false);
  const [inputWidth, setInputWidth] = useState<number>(240);
  const [subjectIdx, setSubjectIdx] = useState<number>(-1);
  const [dummyData, setDummyData] = useState([
    {
      date: "10월 9일",
      description: "1~2강까지 읽기",
    },
    {
      date: "10월 11일",
      description: "3~5강까지 읽기",
    },
    {
      date: "10월 13일",
      description: "완독하기/핵심 문장 메모하기",
    },
    {
      date: "10월 14일",
      description: "독후감 초안 및 최종본 완성하기",
    },
    {
      date: "10월 19일",
      description: "독후감 초안 및 최종본 완성하기",
    },
    {
      date: "10월 19일",
      description: "독후감 초안 및 최종본 완성하기",
    },
  ]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const checkDays = [true, false, true, false, true, true, true];

  // Step 업데이트 핸들러
  const handleStepUpdate = (index: number, newDescription: string) => {
    const newData = [...dummyData];
    newData[index].description = newDescription;
    setDummyData(newData);
  };

  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(Math.max(width + 20, 240)); // 여백 추가, 최소 240px
    }
  }, [title]);

  useEffect(() => {
    const rootElement = document.querySelector("#root") as HTMLElement;
    if (rootElement) {
      const originalOverflow = rootElement.style.overflow;
      rootElement.style.overflow = "hidden";

      return () => {
        rootElement.style.overflow = originalOverflow || "auto";
      };
    }
  }, []);

  // 수정 버튼 클릭 → 편집 모드 토글
  return (
    <>
      <ModalHeader
        onClose={() => {
          setModalOpen(true);
        }}
      />
      <Wrapper>
        <ConfirmModal
          open={modalOpen}
          onConfirm={() => {
            void navigate("/home");
          }}
          onCancel={() => setModalOpen(false)}
          confirmText="확인"
          cancelText="취소"
        />
        <Page>
          <MeasureText ref={measureRef}>{title}</MeasureText>
          <TodoTitle>
            <TitleInput
              name="To-Do Title"
              disabled={!titleModify}
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: `${inputWidth}px` }}
            />
            <Modify onClick={() => setTitleModify(prev => !prev)}>
              <img src={ModifyImg} alt="수정" width="16" height="16" />
            </Modify>
          </TodoTitle>
          <TodoDate>{`${"2025.10.09"} ~ ${"2025.10.14"}`}</TodoDate>
          <Days>
            {days.map((day, index) => (
              <Day key={index} $checked={checkDays[index]}>
                {day}
              </Day>
            ))}
          </Days>
          <TitleWrapper>
            <Title $fontSize={"var(--fs-lg)"} className="typo-h4">
              과제 유형
            </Title>
          </TitleWrapper>
          <SubjectTypes>
            {types.map((type, index) => (
              <SubjectType
                key={index}
                $checked={subjectIdx == index}
                onClick={() => setSubjectIdx(index)}
              >
                {type}
              </SubjectType>
            ))}
          </SubjectTypes>
          <TodoList>
            {dummyData.map((value, index) => (
              <StepComponent
                key={index}
                stepData={value}
                onUpdate={(newDescription: string) => handleStepUpdate(index, newDescription)}
              />
            ))}
          </TodoList>
          <GreenButtonWrapper>
            <GreenButton
              onClick={() => {
                void navigate("/home");
              }}
            >
              투두 적용하기
            </GreenButton>
          </GreenButtonWrapper>
        </Page>
      </Wrapper>
    </>
  );
};

export default Result;
