import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/** 페이지형 모달 (Portal). NavBar 제외/포함 모두 prop으로 제어 가능 */
export default function AdjustGoalModal({
  open,
  onClose,
  title,
  children,
  /** 선택: NavBar 만큼 아래를 비우고 싶으면 전달. 예) "calc(54px + 34px + env(safe-area-inset-bottom, 0px))" */
  navOffset = "0px",
}) {
  if (!open) return null;

  // 모달 루트가 없으면 동적 생성
  const getRoot = () => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    return root;
  };

  // ESC + body 스크롤 잠금
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <Screen
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-steps-modal-title"
      style={{ "--nav-offset": navOffset }}
      onClick={onClose}            // 바깥 탭 닫기
    >
      <Sheet onClick={(e) => e.stopPropagation()}>
        <HeaderBar>
          <Spacer aria-hidden="true" />
          <PageTitle id="goal-steps-modal-title">{title ?? "목표재설정모달페이지"}</PageTitle>
          <CloseBtn type="button" aria-label="닫기" onClick={onClose}>×</CloseBtn>
        </HeaderBar>
        <Body>{children}</Body>
      </Sheet>
    </Screen>,
    getRoot()
  );
}

/* ===== styles ===== */
const Screen = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0;
  /* 🔸 NavBar 제외 모드: 아래 여백을 변수로 남김. 기본 0 = 전체화면 */
  bottom: var(--nav-offset);

  z-index: 2147483647;
  background: var(--bg-1);
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;

  transform: translateY(4%);
  opacity: 0.01;
  animation: pageEnter 220ms ease forwards;
  @keyframes pageEnter { to { transform: translateY(0); opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    animation: none; transform: none; opacity: 1;
  }
`;

const Sheet = styled.div`
  display: flex; flex-direction: column; flex: 1 1 auto;
  min-height: 0; /* for child scroll */
`;

const HeaderBar = styled.header`
  position: sticky; top: 0; z-index: 1;
  display: grid; grid-template-columns: 40px 1fr 40px; align-items: center; gap: 8px;
  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
  padding: 8px 12px;
  background: var(--bg-1);
  border-bottom: 1px solid var(--natural-200);
`;
const Spacer = styled.div`width: 40px; height: 36px;`;
const CloseBtn = styled.button`
  width: 36px; height: 36px; border: 0; border-radius: 12px;
  background: var(--surface-1, var(--bg-1)); color: var(--text-1);
  box-shadow: 0 0 0 1px var(--natural-200) inset; cursor: pointer;
  font-size: 22px; line-height: 1;
`;
const PageTitle = styled.h2`
  margin: 0; text-align: center; font-size: 18px; font-weight: 800; color: var(--text-1);
`;
const Body = styled.div`
  flex: 1 1 auto; overflow: auto;
  padding: 12px 16px calc(env(safe-area-inset-bottom, 0px) + 12px);
`;
