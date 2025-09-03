import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";

/**
 * 목표 조정 모달
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, dday, title, progress, warmMessage }
 */
export default function AdjustGoalModal({ open, onClose, goal }) {
  if (!goal) return null;

  return (
    <PageModal
      open={open}
      onClose={onClose}
      headerVariant="close-right"
    >
      <Section>
        <Row>
          <Label>제목</Label>
          <Value>{goal.title}</Value>
        </Row>
        <Row>
          <Label>ID</Label>
          <Value>{goal.id}</Value>
        </Row>
        <Row>
          <Label>디데이</Label>
          <Value>{goal.dday}</Value>
        </Row>
        <Row>
          <Label>진행률</Label>
          <Value>{goal.progress}%</Value>
        </Row>
      </Section>

      {goal.warmMessage ? (
        <Warm>{goal.warmMessage}</Warm>
      ) : (
        <Warm>목표를 조정해보세요.</Warm>
      )}
    </PageModal>
  );
}

/* ===== 내부 전용 스타일 ===== */
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  color: var(--text-2, #6F737B);
  font-size: 13px;
`;

const Value = styled.span`
  color: var(--text-1, #000);
  font-weight: 700;
`;

const Warm = styled.p`
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--text-1, #111);
`;
