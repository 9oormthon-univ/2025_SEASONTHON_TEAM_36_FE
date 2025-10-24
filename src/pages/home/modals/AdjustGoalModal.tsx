import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { destructToDoByAI } from "@/apis/ai"; // 단계 자동 생성
import { updateTodo } from "@/apis/todo"; // PUT /api/v1/todos/{todoId}
import { RespTodo } from "@/common/types/response/todo";

import FrogEscapeImg from "../../../assets/images/frog-escape-new.svg";
import FrogNoti from "../../../common/components/FrogNoti";
import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import GoalDeadline from "../../calendar/components/GoalDeadline";
import { ModalContainer } from "../styles/ModalContainer";

export type AdjustGoalModalProps = {
  open: boolean;
  onClose?: () => void;
  goal: RespTodo | null | undefined;
  onUpdated?: () => void | Promise<void>;
};

// 새 목표 단계(간단 뷰) 타입
type NewStep = { stepDate: string; description: string };

// AI 응답 타입
interface AiStepsResponse {
  steps?: Array<unknown>;
}

// 타입가드: AbortError
function isAbortError(e: unknown): e is { name: "AbortError" } {
  return typeof e === "object" && e !== null && (e as { name?: unknown }).name === "AbortError";
}

// 타입가드: NewStep
function isNewStep(x: unknown): x is NewStep {
  if (typeof x !== "object" || x === null) return false;
  const obj = x as Record<string, unknown>;
  return typeof obj.stepDate === "string" && typeof obj.description === "string";
}

export default function AdjustGoalModal({ open, onClose, goal, onUpdated }: AdjustGoalModalProps) {
  // 훅은 항상 최상단
  const [status, setStatus] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [addDays, setAddDays] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [stepsOfNewGoal, setStepsOfNewGoal] = useState<NewStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // goal 파생값
  const goalId = goal?.id;
  const title = goal?.title ?? "";
  const stepResponses = goal?.stepResponses ?? [];

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

    if (!goalId) {
      setErrorMsg("유효하지 않은 목표입니다. 다시 시도해 주세요.");
      return;
    }

    const daysNum = Number(addDays);
    if (!Number.isFinite(daysNum) || daysNum <= 0) {
      setErrorMsg("기한(추가 일수)을 1 이상으로 입력해 주세요.");
      return;
    }
    if (charCount > charMax) {
      setErrorMsg(`설명은 ${charMax}자 이내로 작성해 주세요.`);
      return;
    }

    const ac = new AbortController();
    abortControllerRef.current = ac;
    const options: { signal: AbortSignal } = { signal: ac.signal };

    try {
      setSubmitting(true);
      setStatus(1);

      // 기존 스텝을 간단 형태로 전송
      const todoSteps: NewStep[] = stepResponses.map(s => ({
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

      await onUpdated?.();

      // AI 단계 생성: 안전 파싱
      const raw = (await destructToDoByAI(goalId, options)) as AiStepsResponse | null;
      const maybeSteps = raw?.steps ?? [];
      const parsed: NewStep[] = Array.isArray(maybeSteps) ? maybeSteps.filter(isNewStep) : [];

      setStepsOfNewGoal(parsed);
      setStatus(2);
    } catch (err: unknown) {
      if (isAbortError(err)) {
        setStatus(0);
      } else {
        const msg =
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof err.message === "string"
            ? (err as { message: string }).message
            : "재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        console.error(err);
        setErrorMsg(msg);
        setStatus(0);
      }
    } finally {
      setSubmitting(false);
      abortControllerRef.current = null;
    }
  };

  const handleAfterDeadline = () => {
    // 마감 조정 완료 후 상위 동기화 & 닫기
    void onUpdated?.(); // 의도적으로 fire-and-forget 가능
    onClose?.();
  };

  // 훅 호출 이후 조건부 렌더
  if (!goal) return null;

  return (
    <PageModal open={open} onClose={onClose} headerVariant="close-right" viewNavBar>
      {status === 0 && (
        <ModalContainer>
          {/* ... 상단 UI 동일 ... */}
          <Section style={{ borderBottom: "1px solid var(--natural-400)", paddingBottom: 10 }}>
            <Heading className="typo-h2">목표량 재조정</Heading>
            <Textarea
              className="typo-body-m"
              placeholder={
                "완료해야 할 일을 상세하게 작성해주세요!\n\nex)\n메가커피 마케팅 전략 조사 및 새로운 전략 도출\n  ppt 10장 내로\n  SWOT 조사 필수"
              }
              maxLength={charMax}
              value={content}
              onChange={e => setContent(e.target.value)}
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
                onChange={e => setAddDays(e.target.value)}
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
          topText={`개구리를 탈출시킬 계획을\n다시 수립하고 있어요`}
          imageSrc={FrogEscapeImg}
          bottomText={"조금만 기다려주세요..."}
        />
      )}

      {status === 2 && (
        <GoalDeadline
          steps={stepsOfNewGoal}
          setStatus={setStatus}
          setStepsOfNewGoal={setStepsOfNewGoal}
          setFormContents={() => {}}
          // 컴포넌트 시그니처에 맞춰 prop 이름 수정
          handleAllToDo={handleAfterDeadline}
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
  color: var(--text-2, #6f737b);
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
  min-height: 150px;
  resize: vertical;
  padding: 12px;
  border-radius: 4px;
  border: 0.5px solid var(--natural-400);
  background: var(--bg-1);
  &::placeholder {
    color: var(--natural-800, #6f737b);
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
  margin-top: auto;
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
