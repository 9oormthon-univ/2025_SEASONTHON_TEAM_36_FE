import { useCallback, useEffect, useRef, useState } from "react";

import PageModal from "@/common/components/PageModal";

import { destructToDoByAI } from "../../../apis/ai";
import { addTodo } from "../../../apis/todo";
import FrogEscapeImg from "../../../assets/images/frog-escape-new.svg";
import FrogNoti from "../../../common/components/FrogNoti";
import { FormModalProps } from "../types/props";
import { NewStep } from "../types/ToDo";
import Form from "./Form";
import GoalDeadline from "./GoalDeadline";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const FormModal = ({ open, handleAllToDo, handleShowModal }: FormModalProps) => {
  /**
   * 0: 폼 작성
   * 1: 폼 처리 중
   * 2: 폼 처리 완료
   */
  const [status, setStatus] = useState<number>(0);
  const [formContents, setFormContents] = useState<
    [string, string, string | null, string | null, boolean[]]
  >(["", "", "", "", [false, false, false, false, false, false, false]]);
  const [stepsOfNewGoal, setStepsOfNewGoal] = useState<NewStep[]>([]);
  const [toggle, setToggle] = useState(false);
  // AbortController ref to manage API request cancellation
  const abortControllerRef = useRef<AbortController>(null);

  const handleSubmit = useCallback(() => {
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    setStatus(prev => prev + 1);
    const payload = {
      title: formContents[0],
      content: formContents[1],
      startDate: formContents[2],
      endDate: formContents[3],
      expectedDays: DAYS.filter((_, index) => formContents[4][index]),
    };
    const options = {
      signal: abortControllerRef.current.signal, // AbortController signal 전달
    };
    addTodo(payload, options)
      .then(resp => {
        destructToDoByAI(resp.id, options)
          .then(resp => {
            setStepsOfNewGoal(resp.steps);
            setStatus(prev => prev + 1);
          })
          .catch((error: Error | DOMException) => {
            if (error.name === "AbortError") {
              console.error("API 요청이 취소되었습니다.");
              // 요청이 취소된 경우 상태를 초기화
              setStatus(0);
            } else {
              console.error("API 요청 중 오류 발생:", error);
              // 다른 오류의 경우 적절한 에러 처리
              setStatus(0);
            }
          })
          .finally(() => {
            // 요청 완료 후 AbortController 정리
            abortControllerRef.current = null;
          });
      })
      .catch((error: Error | DOMException) => {
        if (error.name === "AbortError") {
          console.error("API 요청이 취소되었습니다.");
          // 요청이 취소된 경우 상태를 초기화
          setStatus(0);
        } else {
          console.error("API 요청 중 오류 발생:", error);
          // 다른 오류의 경우 적절한 에러 처리
          setStatus(0);
        }
      })
      .finally(() => {
        // 요청 완료 후 AbortController 정리
        abortControllerRef.current = null;
      });
  }, [formContents]);

  const handleClose = useCallback(() => {
    // 진행 중인 API 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    handleShowModal();
    setStatus(0);
    setFormContents(["", "", "", "", [false, false, false, false, false, false, false]]);
    setStepsOfNewGoal([]); // 새로운 목표 단계도 초기화
    setToggle(false);

    if (status === 2) {
      void handleAllToDo();
    }
  }, [handleAllToDo, handleShowModal, status]);

  // 컴포넌트 언마운트 시 진행 중인 요청 정리
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <PageModal open={open} onClose={handleClose}>
      {status === 0 ? (
        <Form
          toggle={toggle}
          setToggle={setToggle}
          formContents={formContents}
          setFormContents={setFormContents}
          handleSubmit={handleSubmit}
        />
      ) : status === 1 ? (
        <FrogNoti
          topText={`개구리가 우물을 탈출할\n계획을 짜고 있어요`}
          imageSrc={FrogEscapeImg}
          bottomText={"조금만 기다려주세요..."}
        />
      ) : (
        <GoalDeadline
          steps={stepsOfNewGoal}
          setStatus={setStatus}
          setStepsOfNewGoal={setStepsOfNewGoal}
          setFormContents={setFormContents}
          handleAllToDo={handleAllToDo}
          handleShowModal={handleShowModal}
        />
      )}
    </PageModal>
  );
};

export default FormModal;
