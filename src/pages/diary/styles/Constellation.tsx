import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  margin-top: clamp(0px, calc((100vh - 700px) * 35 / 112), 35px);
  width: auto;
  height: clamp(360px, 60vh, 451px);
  aspect-ratio: 352 / 451;
  max-width: min(352px, 90vw);
  max-height: 100%;
  --constellation-scale-w: clamp(0.6, calc(min(90vw, 352px) / 352px), 1);
  --constellation-scale-h: clamp(0.6, calc(clamp(360px, 60vh, 451px) / 451px), 1);
  --constellation-scale: min(var(--constellation-scale-w), var(--constellation-scale-h));
`;

export const Line = styled.div<{ $left: number; $top: number; $distance: number; $angle: number }>`
  position: absolute;
  height: clamp(1px, 0.4vw, 1.5px);
  background-color: rgba(255, 255, 255, 0.5);
  transform-origin: left center;
  top: calc(${props => props.$top}px * var(--constellation-scale));
  left: calc(${props => props.$left}px * var(--constellation-scale));
  width: calc(${props => props.$distance}px * var(--constellation-scale));
  transform: rotateZ(${props => props.$angle}deg);
`;

export const Star = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: calc(${props => props.$x}px * var(--constellation-scale));
  top: calc(${props => props.$y}px * var(--constellation-scale));
  z-index: 1;
`;

export const StarImg = styled.img<{ $big: boolean }>`
  width: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(12px, 4.5vw, 17px)")};
  height: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(12px, 4.5vw, 17px)")};
`;

export const Day = styled.span<{ $toggle: boolean; $x: number; $y: number }>`
  color: white;
  font-size: clamp(10px, 2.5vw, 14px);
  display: ${props => (props.$toggle ? "block" : "none")};
  position: absolute;
  top: calc(${props => props.$y}px * var(--constellation-scale));
  left: calc(${props => props.$x}px * var(--constellation-scale));
  white-space: nowrap;
`;

export const ToggleButton = styled.button<{ $toggle: boolean }>`
  position: absolute;
  border-radius: 100%;
  background-color: ${props => (props.$toggle ? "white" : "var(--natural-400)")};
  box-shadow: 0px 0px 5px 2px ${props => (props.$toggle ? "var(--natural-400)" : "var(--text-3)")};
  color: ${props => (props.$toggle ? "black" : "var(--text-3)")};
  width: clamp(28px, 9vw, 36px);
  height: clamp(28px, 9vw, 36px);
  font-size: var(--fs-xs);
  bottom: 0;
  right: 0;
`;
