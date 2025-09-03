import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";

/**
 * steps 표시 모달 
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - goal: { id, dday, title, progress, warmMessage }
 */
export default function GoalStepsModal({ open, onClose, goal }) {
  if (!goal) return null;

  return (
    <PageModal
      open={open}
      onClose={onClose}
      headerVariant="back-left"
      viewNavBar
    >
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
        <Value>
          {Number.isFinite(goal.progress) ? `${goal.progress}%` : "0%"}
        </Value>
      </Row>
      {goal.warmMessage ? <Warm>{goal.warmMessage}</Warm> : null}
    </PageModal>
  );
}

/* ===== 내부 스타일 ===== */
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
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-1, #111);
`;
