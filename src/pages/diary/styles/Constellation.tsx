import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  margin-top: 35px;
  width: 352px;
  height: 451px;
`;

export const Star = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
`;

export const Day = styled.span<{ $toggle: boolean; $x: number; $y: number }>`
  color: white;
  font-size: var(--fs-xs);
  display: ${props => (props.$toggle ? "block" : "none")};
  position: absolute;
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
`;

export const ToggleButton = styled.button<{ $toggle: boolean }>`
  position: absolute;
  border-radius: 100%;
  background-color: ${props => (props.$toggle ? "white" : "var(--natural-400)")};
  box-shadow: 0px 0px 5px 2px ${props => (props.$toggle ? "var(--natural-400)" : "var(--text-3)")};
  color: ${props => (props.$toggle ? "black" : "var(--text-3)")};
  width: 36px;
  height: 36px;
  font-size: var(--fs-xs);
  bottom: -15px;
  right: 0;
`;
