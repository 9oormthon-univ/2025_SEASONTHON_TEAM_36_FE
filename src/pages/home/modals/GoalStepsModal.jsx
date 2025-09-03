import React from "react";
import styled from "styled-components";
import PageModal from "../../../common/components/PageModal";

export default function GoalStepsModal({
  open,
  onClose,
  goalId,
  dday,
  title,
  progress,
  warmMessage,
}) {
  return (
    <PageModal
      open={open}
      onClose={onClose}
      title={title}
      headerVariant="back-left"
      viewNavBar
    >
      <Row>
        <Label>ID</Label>
        <Value>{goalId}</Value>
      </Row>
      <Row>
        <Label>디데이</Label>
        <Value>{dday}</Value>
      </Row>
      <Row>
        <Label>진행률</Label>
        <Value>
          {Number.isFinite(+progress) ? `${+progress}%` : "0%"}
        </Value>
      </Row>
      {warmMessage ? <Warm>{warmMessage}</Warm> : null}
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
