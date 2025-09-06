import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { destructToDoByAI } from "../../../apis/ai";
import { addTodo } from "../../../apis/todo";
import CloseImg from "../../../assets/images/close.png";
import FrogRunImg from "../../../assets/images/frog-run.svg";
import FrogNoti from "../../../common/components/FrogNoti";
import Form from "./Form";
import GoalDeadline from "./GoalDeadline";

const ModalStyle = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: ${props => (props.$open ? 0 : 100)}%;
  z-index: 1001;
  transition: top 0.2s linear;
  overflow: auto;

  display: flex;
  flex-direction: column;

  padding-bottom: 55px;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  margin-top: 20px;
  padding: 3px 24px;
`;

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const Modal = ({ open, handleAllToDo, handleShowModal }) => {
  /**
   * 0: 폼 작성
   * 1: 폼 처리 중
   * 2: 폼 처리 완료
   */
  const [status, setStatus] = useState(0);
  const [formContents, setFormContents] = useState([
    "",
    "",
    "",
    "",
    [false, false, false, false, false, false, false],
  ]);
  const [stepsOfNewGoal, setStepsOfNewGoal] = useState([]);
  const [toggle, setToggle] = useState(false);
  // AbortController ref to manage API request cancellation
  const abortControllerRef = useRef(null);

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
          .catch(error => {
            if (error.name === "AbortError") {
              console.log("API 요청이 취소되었습니다.");
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
      .catch(error => {
        if (error.name === "AbortError") {
          console.log("API 요청이 취소되었습니다.");
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
      handleAllToDo();
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
    <ModalStyle $open={open}>
      <Header>
        <button>
          <img src={CloseImg} alt="취소" width="24" height="24" onClick={handleClose} />
        </button>
      </Header>
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
          topText="개구리를 탈출시킬 계획을\n다시 수립하고 있어요"
          imageSrc={FrogRunImg}
          bottomText="조금만 기다려주세요..."
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
    </ModalStyle>
  );
};

export default Modal;
