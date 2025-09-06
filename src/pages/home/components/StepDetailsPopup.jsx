// src/pages/home/components/StepDetailsPopup.jsx
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import cancelIcon from "@/assets/images/cancel.svg";

export default function StepDetailsPopup({ open, onClose, step }) {
  const rootRef = React.useRef(null);

  // 팝업 루트 보장
  React.useEffect(() => {
    let root = document.getElementById("popup-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "popup-root";
      document.body.appendChild(root);
    }
    rootRef.current = root;
  }, []);

  // ESC 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
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
        onClick={(e) => e.stopPropagation()} // 내부 클릭 버블링 방지
      >
        <Header>
          <Title id="step-popup-title">상세보기</Title>
          <CloseBtn onClick={onClose} aria-label="닫기">
            <img src={cancelIcon} alt="" />
          </CloseBtn>
        </Header>
        {step ? (
          <Content>
            <Row><Label>날짜</Label><Value>{step.stepDate}</Value></Row>
            <Row><Label>내용</Label><Value>{step.description}</Value></Row>
            <Row><Label>진행 횟수</Label><Value>{step.count}</Value></Row>
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
    rootRef.current
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
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
  grid-template-columns: max-content 1fr; /* Label은 내용폭, Value는 남는 영역 */
  column-gap: 12px;
  align-items: start;
`;

const Label = styled.span`
  font-size: var(--fs-sm, 14px);
  color: var(--text-2, #555);
  white-space: nowrap;         /* Label은 줄바꿈 없이 고정 */
`;

const Value = styled.span`
  font-size: var(--fs-sm, 14px);
  font-weight: 500;
  color: var(--text-1, #000);
  min-width: 0;                /* 그리드/플렉스에서 줄바꿈 위해 필요 */
  white-space: normal;         /* 공백 기준 줄바꿈 */
  word-break: keep-all;        /* 한국어 단어 보존 */
  overflow-wrap: anywhere;     /* 긴 영어/URL은 예외적으로 끊기 */
  line-height: 1.4;            /* 가독성 */
`;
