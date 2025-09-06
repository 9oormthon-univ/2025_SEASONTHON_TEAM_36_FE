import { motion } from "framer-motion";
import styled from "styled-components";

/** Backdrop: 네비 영역은 가리지 않음 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0 0 var(--navbar-height, 0px) 0;
  // background: rgba(0,0,0,0.36);
  // backdrop-filter: saturate(120%) blur(2px);
  z-index: 900;
`;

/** Panel: 네비바에 정확히 맞닿도록 보더 보정 */
export const Panel = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: calc(var(--navbar-height, 0px) - var(--nav-border-top, 0px));
  width: 100vw;
  height: ${({ $size }) => $size};
  background: var(--bg-1, #fff);
  color: var(--text-1, #101014);
  box-shadow: -0.3px -0.3px 5px 0 var(--natural-400, #D6D9E0), 0.3px 0.3px 5px 0 var(--natural-400, #D6D9E0);
  outline: none;
  border-radius: 40px 40px 0 0;
  display: flex;
  flex-direction: column;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  & > div[aria-hidden="false"] { pointer-events: auto; } /* GrabHandle */
`;

export const GrabHandle = styled.div`
  display: grid; place-items: center; padding: 8px 0 0 0; cursor: grab;
  & > span {
    display: block; width: 34px; height: 3px;
    background: var(--text-w2, #f1f4f8); border-radius: 999px;
  }
`;

export const SheetViewport = styled.div`
  display: flex; flex-direction: column;
  height: 90%;
  overflow: hidden;
`;
