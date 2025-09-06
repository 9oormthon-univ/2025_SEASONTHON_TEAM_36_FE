import React from "react";
import { createPortal } from "react-dom";

import backArrow from "@/assets/images/back-arrow.svg";
import cancelIcon from "@/assets/images/cancel.svg";

import {
  Body,
  HeaderBar,
  IconBtn,
  IconImg,
  Screen,
  Spacer,
  Title,
} from "./styles";

/** ===================== 내부 헤더 컴포넌트 ===================== */
export function ModalHeader({
  variant = "close-right", // 'back-left' | 'close-right'
  title = "",
  onBack,
  onClose,
  titleId = "page-modal-title",
}) {
  if (variant === "back-left") {
    return (
      <HeaderBar>
        <IconBtn
          type="button"
          aria-label="뒤로가기"
          onClick={onBack ?? onClose}
          data-variant="back"
        >
          <IconImg src={backArrow} alt="" aria-hidden="true" />
        </IconBtn>
        <Title id={titleId}>{title}</Title>
        <Spacer aria-hidden="true" />
      </HeaderBar>
    );
  }
  // 'close-right'
  return (
    <HeaderBar>
      <Spacer aria-hidden="true" />
      <Title id={titleId}>{title}</Title>
      <IconBtn
        type="button"
        aria-label="닫기"
        onClick={onClose ?? onBack}
        data-variant="close"
      >
        <IconImg src={cancelIcon} alt="" aria-hidden="true" />
      </IconBtn>
    </HeaderBar>
  );
}

/** ===================== 메인 모달 컴포넌트 ===================== */
/** NavBar 위까지 꽉 차는 페이지형 모달 (Portal) */
export default function PageModal({
  open,
  onClose,
  title,
  children,
  headerVariant = "close-right",
  viewNavBar = false,
}) {
  const rootRef = React.useRef(null);

  // 모달 루트 보장
  React.useEffect(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    rootRef.current = root;
  }, []);

  // ESC + body 스크롤 잠금
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !rootRef.current) return null;

  return createPortal(
    <Screen
      role="dialog"
      aria-modal="true"
      aria-labelledby="page-modal-title"
      $viewNavBar={viewNavBar}
    >
      <ModalHeader
        variant={headerVariant}
        title={title ?? ""}
        onBack={onClose}
        onClose={onClose}
        titleId="page-modal-title"
      />
      <Body>{children}</Body>
    </Screen>,
    rootRef.current
  );
}
