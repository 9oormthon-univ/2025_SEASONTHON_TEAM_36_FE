import styled from "styled-components";
import { motion } from "framer-motion";

/** 바깥 영역: NavBar는 가리지 않음 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0 0 var(--navbar-height, 0px) 0;
  background: rgba(0,0,0,0.36);
  backdrop-filter: saturate(120%) blur(2px);
  z-index: 900;
`;

export const Panel = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: var(--navbar-height, 0px);
  width: 100vw;
  height: ${({ $size }) => $size};
  background: var(--surface-1, #fff);
  color: var(--text-1, #101014);
  box-shadow: 0 -12px 36px rgba(0,0,0,0.18);
  outline: none;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;

  /* 닫혔을 때 내용 상호작용 막고 GrabHandle만 허용 */
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  & > div[aria-hidden="false"] { pointer-events: auto; } /* GrabHandle */
`;

export const GrabHandle = styled.div`
  display: grid;
  place-items: center;
  padding: 8px 0 4px;
  cursor: grab;

  & > span {
    display: block;
    width: 44px; height: 5px;
    background: var(--surface-2, #f1f4f8);
    border-radius: 999px;
  }
`;

export const SheetViewport = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - var(--peek, 28px)); /* GrabHandle 높이만큼 */
  max-height: calc(100% - var(--peek, 28px));
  overflow: hidden;
`;
