import styled from "styled-components";

export const Viewport = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  touch-action: pan-y;
  user-select: none;
  background: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  &:focus { outline: none; }
  &:focus-visible { outline: none; }
`;

export const Track = styled.div`
  display: flex;
  will-change: transform;
`;

export const Slide = styled.div`
  flex: 0 0 100%;
  min-width: 100%;
  padding: 8px;
`;
