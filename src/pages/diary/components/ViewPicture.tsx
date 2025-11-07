import { useCallback, useEffect } from "react";
import styled from "styled-components";

type ViewPictureProps = {
  open: boolean;
  src: string | null | undefined;
  alt?: string;
  onClose: () => void;
  /** 배경 클릭 시 닫기 (기본값: true) */
  closeOnBackdrop?: boolean;
  /** z-index (기본값: 9999) */
  zIndex?: number;
  /** 이미지 최대 크기 (기본값: maxWidth 92vw, maxHeight 82vh) */
  maxWidth?: number | string;
  maxHeight?: number | string;
};

export default function ViewPicture({
  open,
  src,
  alt = "사진 미리보기",
  onClose,
  closeOnBackdrop = true,
  zIndex = 9999,
  maxWidth = "min(92vw, 1200px)",
  maxHeight = "82vh",
}: ViewPictureProps) {
  // 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC 닫기
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, handleKeydown]);

  if (!open || !src) return null;

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label="사진 미리보기"
      $zIndex={zIndex}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <ImgWrapper onClick={e => e.stopPropagation()}>
        <Img src={src} alt={alt} style={{ maxWidth, maxHeight }} draggable={false} />
      </ImgWrapper>

      <CloseButton onClick={onClose} aria-label="닫기" title="닫기 (Esc)">
        ×
      </CloseButton>
    </Overlay>
  );
}

/* ================= styled ================= */

const Overlay = styled.div<{ $zIndex: number }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${p => p.$zIndex};
  padding: 16px;
`;

const ImgWrapper = styled.div`
  max-width: 92%;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  background: #000;
  overflow: hidden;
`;

const Img = styled.img`
  display: block;
  object-fit: contain;
  user-select: none;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  line-height: 1;
`;
