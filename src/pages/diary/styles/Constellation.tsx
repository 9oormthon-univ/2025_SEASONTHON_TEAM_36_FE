import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  margin-top: clamp(20px, calc((100vh - 700px) * 35 / 112), 35px);
  width: clamp(220px, min(85vw, calc(55vh * 352 / 451)), 352px);
  height: clamp(282px, min(calc(85vw * 451 / 352), 55vh), 451px);
  aspect-ratio: 352 / 451;
  max-width: 352px;
  max-height: 451px;
  --constellation-scale-w: clamp(0.625, calc(min(85vw, 352px) / 352px), 1);
  --constellation-scale-h: clamp(
    0.625,
    calc(clamp(282px, min(calc(85vw * 451 / 352), 55vh), 451px) / 451px),
    1
  );
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
  cursor: pointer;
`;

export const StarImg = styled.img<{ $big: boolean }>`
  display: block;
  width: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(12px, 4.5vw, 17px)")};
  height: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(12px, 4.5vw, 17px)")};
  z-index: 1;
  position: relative;
`;

export const Day = styled.span<{ $toggle: boolean; $x: number; $y: number }>`
  color: white;
  font-size: clamp(10px, 2.5vw, 12px);
  display: ${props => (props.$toggle ? "block" : "none")};
  position: absolute;
  top: calc(${props => props.$y}px * var(--constellation-scale));
  left: calc(${props => props.$x}px * var(--constellation-scale));
  white-space: nowrap;
`;

export const Light = styled.div<{ $big: boolean }>`
  background: #fff;
  border: 1px solid #000;
  filter: ${props => (props.$big ? "blur(8.55px)" : "blur(5px)")};
  width: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(21px, 4.5vw, 25px)")};
  height: ${props => (props.$big ? "clamp(28px, 8.5vw, 34.7px)" : "clamp(21px, 4.5vw, 25px)")};
  border-radius: 50%;
  position: absolute;
  left: ${props => (props.$big ? 0 : -1.5)}px;
  top: ${props => (props.$big ? 0 : -1.5)}px;
  z-index: 0;
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
