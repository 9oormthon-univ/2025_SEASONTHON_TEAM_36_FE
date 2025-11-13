import styled from "styled-components";

const PageSwiper = styled.div<{
  $dragOffset: number;
  $isDragging: boolean;
  $isTransitioning?: boolean;
}>`
  transform: translateX(${props => props.$dragOffset}px);
  transition: ${props =>
    props.$isDragging ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out"};
  opacity: ${props => (props.$isTransitioning ? 0.5 : 1)};
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export default PageSwiper;
