import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchSteps } from "@/apis/step";
import { deleteTodo } from "@/apis/todo";
import EscapeFrogImg from "@/assets/images/frog-escape-new.svg";
import ModifyImg from "@/assets/images/modify-result.svg";
import ConfirmModal from "@/common/components/ConfirmModal";
import FrogNoti from "@/common/components/FrogNoti";
import GreenButton from "@/common/components/GreenButton";
import { ModalHeader } from "@/common/components/PageModal";
import { RespStepInfo } from "@/common/types/response/step";

import Step from "./components/Step";
import {
  Day,
  Days,
  GreenButtonWrapper,
  MeasureText,
  Modify,
  Page,
  SubjectType,
  SubjectTypes,
  Title,
  TitleInput,
  TitleWrapper,
  TodoDate,
  TodoList,
  TodoTitle,
  Wrapper,
} from "./styles";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState<string>("");
  // const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [splashOpen, setSplashOpen] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [titleModify, setTitleModify] = useState<boolean>(false);
  const [inputWidth, setInputWidth] = useState<number>(240);
  const [subjectIdx, setSubjectIdx] = useState<number>(-1);
  const measureRef = useRef<HTMLSpanElement>(null);
  const checkDays = [true, false, true, false, true, true, true];
  const [steps, setSteps] = useState<RespStepInfo[]>([]);

  // Step 업데이트 핸들러
  const handleRemoveTodo = useCallback(() => {
    const state = location.state as { todoId?: number } | null;
    if (state?.todoId) {
      deleteTodo(state.todoId)
        .then(_ => {})
        .catch(error => console.error(error));
    }
  }, [location.state]);

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

  useEffect(() => {
    const state = location.state as { todoId?: number } | null;
    if (state?.todoId) {
      fetchSteps(state.todoId)
        .then(response => {
          if (
            typeof response === "object" &&
            "title" in response &&
            Array.isArray(response.steps)
          ) {
            setSplashOpen(false);
            setTitle(response.title);
            // setStartDate(response.startDate);
            setEndDate(response.endDate.split("-").join("."));
            setSteps(response.steps);
          }
        })
        .catch(error => console.error(error));
    } else {
      setSplashOpen(false);
      setIsError(true);
      return;
    }
  }, [location.state]);

  if (!splashOpen && isError) {
    return "할일 정보가 없습니다 🥲";
  }

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
            handleRemoveTodo();
            void navigate("/home");
          }}
          onCancel={() => setModalOpen(false)}
          message={"지금 대화를 그만두면\n학습계획이 저장되지 않아요"}
          confirmText="나가기"
          cancelText="취소"
        />
        {splashOpen ? (
          <FrogNoti
            topText={"개구리가 우물을 탈출할\n계획을 짜고 있어요"}
            imageSrc={EscapeFrogImg}
            bottomText={"조금만 기다려 주세요..."}
          />
        ) : (
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
            <TodoDate>{`${"2025.11.08"} ~ ${endDate}`}</TodoDate>
            <Days>
              {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
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
              {["예습/복습", "숙제", "시험공부", "수행평가", "진로활동", "기타"].map(
                (type, index) => (
                  <SubjectType
                    key={index}
                    $checked={subjectIdx == index}
                    onClick={() => setSubjectIdx(index)}
                  >
                    {type}
                  </SubjectType>
                ),
              )}
            </SubjectTypes>
            <TodoList>
              {steps.map((value, index) => (
                <Step key={index} stepData={value} />
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
        )}
      </Wrapper>
    </>
  );
};

export default Result;
