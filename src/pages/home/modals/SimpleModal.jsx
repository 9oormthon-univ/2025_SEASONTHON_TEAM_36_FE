// src/components/SimpleModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

/** NavBar 위까지 꽉 차는 페이지형 모달 (Portal) */
export default function SimpleModal({
  open,
  onClose,
  title,
  children,
  /** NavBar 높이(기본: 54px 아이콘영역 + 34px 라벨영역 + safe-bottom) */
  navOffset = "calc(54px + 34px + env(safe-area-inset-bottom, 0px))",
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
      aria-labelledby="page-modal-title"
      style={{ "--nav-offset": navOffset }}
    >
      <HeaderBar>
        <Spacer aria-hidden="true" />
        <PageTitle id="page-modal-title">{title ?? "상세"}</PageTitle>
        <CloseBtn type="button" aria-label="닫기" onClick={onClose}>×</CloseBtn>
      </HeaderBar>

      <Body>{children}</Body>
    </Screen>,
    getRoot()
  );
}

/* ===== styles: NavBar 제외 전체 덮기 ===== */
const Screen = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;

  /* ⭐️ NavBar 높이만큼 아래를 비워서 NavBar 클릭 가능 */
  bottom: var(--nav-offset);

  z-index: 2147483647; /* 앱 모든 요소 위 */
  background: var(--bg-1);
  color: var(--text-1);
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;

  /* 살짝 위에서 슬라이드-인 */
  transform: translateY(4%);
  opacity: 0.01;
  animation: pageEnter 220ms ease forwards;
  @keyframes pageEnter { to { transform: translateY(0); opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    animation: none; transform: none; opacity: 1;
  }
`;

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 8px;

  padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;

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
