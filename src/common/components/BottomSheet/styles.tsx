import { motion } from "framer-motion";
import styled from "styled-components";

/** Props 타입 정의 */
interface PanelProps {
  /** 패널 높이 (예: "50vh", "80%" 등) */
  $size: string;
  /** 오픈 여부: true일 때만 클릭 가능 */
  $open: boolean;
}

/** Backdrop: 네비 영역은 가리지 않음 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0 0 var(--navbar-height, 0px) 0;
  /* background: rgba(0,0,0,0.36);
  backdrop-filter: saturate(120%) blur(2px); */
  z-index: 900;
`;

/** Panel: 네비바에 정확히 맞닿도록 보더 보정 */
export const Panel = styled(motion.div)<PanelProps>`
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: calc(var(--navbar-height, 0px) - var(--nav-border-top, 0px));
  width: 100vw;
  height: ${({ $size }) => $size};
  background: var(--bg-1, #fff);
  color: var(--text-1, #101014);
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  outline: none;
  border-radius: 40px 40px 0 0;
  display: flex;
  flex-direction: column;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

  & > div[aria-hidden="false"] {
    pointer-events: auto;
  } /* GrabHandle */
`;

/** GrabHandle */
export const GrabHandle = styled.div`
  position: absolute;
  z-index: 2;
  inset: 0 0 auto 0; /* 상단 가로 전체 영역 */
  height: 56px;
  display: grid;
  place-items: center;
  cursor: grab;
  /* 투명 배경(클릭/드래그 영역만 확보) */
  background: transparent;
  /* 드래그 중 커서 */
  &:active {
    cursor: grabbing;
  }
`;

/** SheetViewport */
export const SheetViewport = styled.div`
  display: flex;
  flex-direction: column;
  height: 90%;
  overflow: hidden;
  padding: 4px 0 0 0;
`;
