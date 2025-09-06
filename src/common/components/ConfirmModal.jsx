// src/features/.../modals/ConfirmDelete.jsx
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/**
 * ConfirmDelete
 * - open: boolean
 * - onConfirm: () => void
 * - onCancel: () => void
 * - message?: string (default: "정말 삭제하겠습니까?")
 * - confirmText?: string (default: "예")
 * - cancelText?: string (default: "아니오")
 */
export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  message = "정말 삭제하겠습니까?",
  confirmText = "예",
  cancelText = "아니오",
}) {
  if (!open) return null;

  // ensure modal root
  const getRoot = () => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    return root;
  };

  const cancelRef = React.useRef(null);
  const confirmRef = React.useRef(null);
  const dialogRef = React.useRef(null);

  // focus first button & esc handler, body scroll lock
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 초기 포커스: 취소 버튼에
    setTimeout(() => cancelRef.current?.focus(), 0);

    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") onConfirm?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel, onConfirm]);

  const portalRoot = getRoot();

  return createPortal(
    <Overlay role="presentation" onMouseDown={(e) => {
      // 바깥 클릭으로 닫기 (컨텐츠 클릭은 무시)
      if (e.target === e.currentTarget) onCancel?.();
    }}>
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <Message id="confirm-delete-title" className="typo-button">{message}</Message>

        <Buttons role="group" aria-label="삭제 확인">

          <Button
            ref={cancelRef}
            data-variant="cancel"
            onClick={onCancel}
            aria-label={`${cancelText} (취소)`}
          >
            {cancelText}
          </Button>
          <Divider aria-hidden="true" />
          <Button
            ref={confirmRef}
            data-variant="confirm"
            onClick={onConfirm}
            aria-label={`${confirmText} (확인)`}
            className="typo-body-m"
          >
            {confirmText}
          </Button>
        </Buttons>
      </Dialog>
    </Overlay>,
    portalRoot
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg-1, #000), transparent 40%);
  display: grid;
  place-items: center;
  z-index: 2147483647;

  /* 애니메이션 */
  animation: fadeIn 140ms ease-out;
  @keyframes fadeIn {
    from { opacity: .001; }
    to { opacity: 1; }
  }
`;

const Dialog = styled.div`
  width: clamp(260px, 60vw, 480px);
  background: var(--surface-1, #fff);
  color: var(--text-1, #111);
  border-radius: 14px;
  box-shadow:
    0 8px 28px rgba(0,0,0,.14),
    0 2px 8px rgba(0,0,0,.10);
  overflow: hidden;

  /* 컨텐츠 간격 */
  display: grid;
  grid-template-rows: auto 1fr;
`;

const Message = styled.div`
  padding: 18px 20px 16px;
  text-align: center;
  font-size: 16px;
  line-height: 1.35;
  font-weight: 600;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: stretch;
  border-top: 1px solid var(--natural-600, #969BA5);
`;

const Divider = styled.div`
  width: 1px;
  background: var(--natural-600, #969BA5);
`;

const Button = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  margin: 0;
  padding: 10px;
  cursor: pointer;

  color: ${({ ["data-variant"]: v }) =>
    v === "confirm" ? "var(--brand-1, #0E7400)" : "var(--text-1, #111)"};

  &:focus-visible {
    outline: 2px solid var(--brand-1, #0E7400);
    outline-offset: -2px;
  }

  &:active {
    background: var(--surface-2, #f5f7fa);
  }
`;
