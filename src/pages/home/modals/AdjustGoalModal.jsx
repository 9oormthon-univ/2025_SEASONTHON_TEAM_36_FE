import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { destructToDoByAI } from "@/apis/ai";    // 단계 자동 생성
import { updateTodo } from "@/apis/todo";        // PUT /api/v1/todos/{todoId}

import FrogRunImg from "../../../assets/images/frog-run.svg";
import FrogNoti from "../../../common/components/FrogNoti";
import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import GoalDeadline from "../../calendar/components/GoalDeadline";
import { ModalContainer } from "../styles/ModalContainer";

/**
 * 목표 조정 모달
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, title, stepResponses: [...] }
 *  - onUpdated?: () => void -> 지금은 적용안함
 */
export default function AdjustGoalModal({ open, onClose, goal, onUpdated}) {
  if (!goal) return null;

  const { id: goalId, title, stepResponses = [] } = goal;

  // 0: 입력 폼, 1: 처리 중, 2: 결과(GoalDeadline)
  const [status, setStatus] = useState(0);

  const [content, setContent] = useState("");
  const [addDays, setAddDays] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stepsOfNewGoal, setStepsOfNewGoal] = useState([]);

  const abortControllerRef = useRef(null);

  // 모달 닫을 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setStatus(0);
      setContent("");
      setAddDays("");
      setErrorMsg("");
      setSubmitting(false);
      setStepsOfNewGoal([]);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [open]);

  const charMax = 1000;
  const charCount = content.length;

  const handleRestart = async () => {
    setErrorMsg("");

    const daysNum = Number(addDays);
    if (!Number.isFinite(daysNum) || daysNum <= 0) {
      setErrorMsg("기한(추가 일수)을 1 이상으로 입력해 주세요.");
      return;
    }
    if (charCount > charMax) {
      setErrorMsg(`설명은 ${charMax}자 이내로 작성해 주세요.`);
      return;
    }

    abortControllerRef.current = new AbortController();
    const options = { signal: abortControllerRef.current.signal };

    try {
      setSubmitting(true);
      setStatus(1);

      // 부모 goal에서 steps 바로 사용
      const todoSteps = stepResponses.map((s) => ({
        stepDate: s.stepDate,
        description: s.description,
      }));

      const payload = {
        title,
        content: content.trim(),
        addDays: daysNum,
        todoSteps,
      };
      await updateTodo(goalId, payload, options);

      // 상위 재조회 필요시
      onUpdated?.();

      // AI 단계 생성
      const result = await destructToDoByAI(goalId, options);
      const steps = Array.isArray(result?.steps) ? result.steps : [];
      setStepsOfNewGoal(steps);

      setStatus(2);
    } catch (err) {
      if (err?.name === "AbortError") {
        setStatus(0);
      } else {
        console.error(err);
        setErrorMsg("재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        setStatus(0);
      }
    } finally {
      setSubmitting(false);
      abortControllerRef.current = null;
    }
  };

  const handleAfterDeadline = () => {
    onUpdated?.();
    onClose?.();
  };

  return (
    <PageModal open={open} onClose={onClose} headerVariant="close-right" viewNavBar>
      {status === 0 && (
        <ModalContainer>
          <Section>
            <Heading className="typo-h2">재도약하기</Heading>
            <Desc>
              실패는 성공의 어머니예요. 좌절하지 말고
              <br />
              목표량을 줄이거나 기한을 늘려보세요.
            </Desc>
          </Section>

          <Section style={{ borderBottom: "1px solid var(--natural-400)", paddingBottom: 10 }}>
            <Heading className="typo-h2">목표량 재조정</Heading>
            <Textarea
              className="typo-body-m"
              placeholder={
                "완료해야 할 일을 상세하게 작성해주세요!\n\nex)\n메가커피 마케팅 전략 조사 및 새로운 전략 도출\n  ppt 10장 내로\n  SWOT 조사 필수"
              }
              maxLength={charMax}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <CharCount>
              {charCount}/{charMax}
            </CharCount>
          </Section>

          <Section>
            <Label className="typo-h3">기한 재조정</Label>
            <DeadlineInput>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                inputMode="numeric"
              />
              <span>일 추가</span>
            </DeadlineInput>
          </Section>

          {errorMsg && <ErrorText role="alert">{errorMsg}</ErrorText>}

          <ButtonRow>
            <GreenButton
              onClick={handleRestart}
              disabled={submitting || !goalId}
              aria-busy={submitting}
            >
              {submitting ? "처리 중..." : "RESTART"}
            </GreenButton>
          </ButtonRow>
        </ModalContainer>
      )}

      {status === 1 && (
        <FrogNoti
          topText={"개구리를 탈출시킬 계획을\n다시 수립하고 있어요"}
          imageSrc={FrogRunImg}
          bottomText={"조금만 기다려주세요..."}
        />
      )}

      {status === 2 && (
        <GoalDeadline
          steps={stepsOfNewGoal}
          setStatus={setStatus}
          setStepsOfNewGoal={setStepsOfNewGoal}
          setFormContents={() => {}}
          handleModifyStep={handleAfterDeadline}
          handleShowModal={onClose}
        />
      )}
    </PageModal>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const Heading = styled.h2`
  color: var(--text-1, #000);
`;

const Desc = styled.p`
  color: var(--text-2, #6F737B);
  font-size: var(--fs-lg, 16px);
  font-weight: 500;
  line-height: var(--lh-m, 24px);
`;

const Label = styled.h3`
  color: var(--text-1, #000);
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  border-radius: 4px;
  border: 0.5px solid var(--natural-400);
  background: var(--bg-1);
  &::placeholder {
    color: var(--natural-800, #6F737B);
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 14px;
  color: var(--text-3, #8a8f98);
`;

const DeadlineInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2%;
  gap: 5%;
  input {
    width: 30%;
    padding: 8px;
    border-radius: 2px;
    border: 1px solid var(--natural-400);
    text-align: center;
    font-size: 14px;
    color: var(--text-1);
    background: var(--bg-1);
  }
  span {
    font-size: 14px;
    color: var(--text-1);
  }
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  color: #c62828;
  font-size: 14px;
  text-align: center;
`;

const ButtonRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;
