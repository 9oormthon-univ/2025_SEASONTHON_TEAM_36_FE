import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";
import { DDayIcon } from "../styles/DDayIcon";
import trashIcon from "@/assets/images/trash.svg";
import FrogBar from "../components/FrogBar";

/** 🔸 하드코딩된 steps 포함 샘플 데이터 */
const SAMPLE = {
  dDay: "D-10",
  title: "우물밖개구리 프로젝트",
  endDate: "2025-09-05",
  progressText: "개구리가 햇빛을 보기 시작했어요!",
  progress: 50,
  steps: [
    {
      stepDate: "2025-09-02",
      stepOrder: 1,
      description: "ToDo ERD 설계",
      count: 0,
      isCompleted: false,
    },
    {
      stepDate: "2025-09-02",
      stepOrder: 2,
      description: "ToDo ERD 설계2",
      count: 0,
      isCompleted: false,
    },
    {
      stepDate: "2025-09-02",
      stepOrder: 3,
      description: "ToDo ERD 설계3",
      count: 0,
      isCompleted: false,
    },
    {
      stepDate: "2025-09-02",
      stepOrder: 4,
      description: "ToDo ERD 설계4",
      count: 0,
      isCompleted: false,
    },
    {
      stepDate: "2025-09-02",
      stepOrder: 5,
      description: "ToDo ERD 설계5",
      count: 0,
      isCompleted: false,
    },
    {
      stepDate: "2025-09-02",
      stepOrder: 6,
      description: "ToDo ERD 설계6",
      count: 0,
      isCompleted: false,
    },
  ],
};

/**
 * steps 표시 모달
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, dday|dDay, title, progress, warmMessage|progressText, dueDate|endDate }
 *    ⚠️ steps는 prop을 무시하고 위 SAMPLE.steps를 사용합니다.
 */
export default function GoalStepsModal({ open, onClose, goal }) {
  // 표시용 뷰 모델: goal → 없으면 SAMPLE 값으로 보강, steps는 항상 SAMPLE.steps 사용
  const view = React.useMemo(() => {
    const g = goal ?? {};
    return {
      dday: g.dday ?? g.dDay ?? SAMPLE.dDay,
      dueDate: g.dueDate ?? g.endDate ?? SAMPLE.endDate,
      title: g.title ?? SAMPLE.title,
      warmMessage: g.warmMessage ?? g.progressText ?? SAMPLE.progressText,
      progress: Number.isFinite(+g.progress) ? +g.progress : SAMPLE.progress,
      steps: SAMPLE.steps, // ✅ 하드코딩
    };
  }, [goal]);

  return (
    <PageModal open={open} onClose={onClose} headerVariant="back-left" viewNavBar>
      <Header>
        <DDayIcon>{view.dday}</DDayIcon>
        <DueDate>마감일: {view.dueDate}</DueDate>
        <DeleteButton type="button" aria-label="목표 삭제">
          <img src={trashIcon} alt="삭제" />
        </DeleteButton>
      </Header>

      <Title>{view.title}</Title>
      <WarmMsg>{view.warmMessage}</WarmMsg>

      <Content>
        <FrogWrap>
          <FrogBar progress={view.progress} />
        </FrogWrap>

        <Steps role="list" aria-label="진행 단계 목록">
          {view.steps.map((s) => (
            <StepItem key={s.stepOrder} role="listitem">
              <StepDate>{s.stepDate}</StepDate>
              <StepTitle>{s.description}</StepTitle>

              {/* count가 의미 있을 때 작은 배지로 표기(0이면 숨김) */}
              {s.count > 0 && <CountBadge aria-label={`횟수 ${s.count}`}>{s.count}</CountBadge>}

              <StepButton
                type="button"
                title={s.isCompleted ? "완료됨" : "시작"}
                aria-label={s.isCompleted ? "완료됨" : "시작"}
                disabled={s.isCompleted}
              >
                {s.isCompleted ? "✔" : "▶"}
              </StepButton>
            </StepItem>
          ))}
        </Steps>
      </Content>
    </PageModal>
  );
}

/* ===== styled-components ===== */

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const DueDate = styled.span`
  font-size: clamp(12px, 2.5vw, 16px);
  color: var(--text-2);
  flex: 1;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  img { width: 18px; height: auto; display: block; }
`;

const Title = styled.h1`
  font-size: clamp(16px, 3.5vw, 24px);
  font-weight: 700;
  margin: 16px 0 8px;
  text-align: center;
`;

const WarmMsg = styled.p`
  font-size: clamp(12px, 2.5vw, 16px);
  color: var(--text-2);
  text-align: center;
  margin-bottom: 16px;
`;

const Content = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
`;

const FrogWrap = styled.div`
  flex: 0 0 40px; /* FrogBar 영역 */
  display: flex;
  justify-content: center;
`;

const Steps = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const StepItem = styled.li`
  background: var(--surface-1);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepDate = styled.span`
  font-size: 12px;
  color: var(--text-2);
  white-space: nowrap;
`;

const StepTitle = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CountBadge = styled.span`
  background: var(--surface-2, rgba(0,0,0,0.06));
  color: var(--text-2);
  font-size: 12px;
  border-radius: 10px;
  padding: 2px 6px;
`;

const StepButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--brand-1);
  padding: 4px 6px;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
