import React from "react";
import { createPortal } from "react-dom";
import backArrow from "@/assets/images/back-arrow.svg";
import {
  Screen,
  HeaderBar,
  Title,
  Spacer,
  IconBtn,
  IconImg,
  X,
  Body,
} from "./styles";

/** ===================== 내부 헤더 컴포넌트 ===================== */
function ModalHeader({
  variant = "back-left",              // 'back-left' | 'close-right'
  title = "상세",
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
        <X aria-hidden="true">×</X>
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
  headerVariant = "close-right",   // 기본은 오른쪽 X버튼
  viewNavBar = false,              // ✅ 추가: true면 NavBar를 보이게 (아래 여백 확보)
}) {
  if (!open) return null;

  // 모달 루트 보장
  const getRoot = React.useCallback(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    return root;
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

  return createPortal(
    <Screen
      role="dialog"
      aria-modal="true"
      aria-labelledby="page-modal-title"
      $viewNavBar={viewNavBar}          
    >
      <ModalHeader
        variant={headerVariant}
        title={title ?? "상세"}
        onBack={onClose}
        onClose={onClose}
        titleId="page-modal-title"
      />
      <Body>{children}</Body>
    </Screen>,
    getRoot()
  );
}
