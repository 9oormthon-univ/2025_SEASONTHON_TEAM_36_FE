// src/pages/home/components/StepDetailsPopup.tsx
// src/pages/home/components/StepDetailsPopup.tsx
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import cancelIcon from "@/assets/images/cancel.svg";

import type { StepViewItem } from "../types/steps"; // ← 공용 뷰 모델에 isCompleted, count 포함

interface StepDetailsPopupProps {
  open: boolean;
  onClose?: () => void;
  step: StepViewItem | null;
}

export default function StepDetailsPopup({ open, onClose, step }: StepDetailsPopupProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let root = document.getElementById("popup-root") as HTMLDivElement | null;
    if (!root) {
      root = document.createElement("div");
      root.id = "popup-root";
      document.body.appendChild(root);
    }
    rootRef.current = root;
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !rootRef.current) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="step-popup-title"
        onClick={e => e.stopPropagation()}
      >
        <Header>
          <Title id="step-popup-title">상세보기</Title>
          <CloseBtn type="button" onClick={onClose} aria-label="닫기">
            <img src={cancelIcon} alt="" />
          </CloseBtn>
        </Header>

        {step ? (
          <Content>
            <Row>
              <Label>날짜</Label>
              <Value>{step.stepDate}</Value>
            </Row>
            <Row>
              <Label>내용</Label>
              <Value>{step.description}</Value>
            </Row>
            <Row>
              <Label>진행 횟수</Label>
              <Value>{step.count}</Value>
            </Row>
            <Row>
              <Label>완료 여부</Label>
              <Value>{step.isCompleted ? "완료" : "미완료"}</Value>
            </Row>
          </Content>
        ) : (
          <Content>스텝 정보가 없습니다.</Content>
        )}
      </Dialog>
    </Overlay>,
    rootRef.current,
  );
}
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
`;

const Dialog = styled.div`
  background: var(--surface-1, #fff);
  color: var(--text-1, #000);
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--fs-lg, 18px);
  font-weight: 600;
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 12px;
  align-items: start;
`;

const Label = styled.span`
  font-size: var(--fs-sm, 14px);
  color: var(--text-2, #555);
  white-space: nowrap;
`;

const Value = styled.span`
  font-size: var(--fs-sm, 14px);
  font-weight: 500;
  color: var(--text-1, #000);
  min-width: 0;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-height: 1.4;
`;
