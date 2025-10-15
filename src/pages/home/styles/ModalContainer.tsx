import styled from "styled-components";

// '$gap'은 transient prop (DOM으로 전달되지 않음)
export const ModalContainer = styled.div<{ $gap?: string }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "10%"};
  padding: 10px;
  background: var(--bg-1);
  color: var(--text-1);

  /* h <= 700px: 여백 축소 */
  @media (max-height: 700px) {
    gap: 4%;
    padding: 12px;
  }
`;
