import styled from "styled-components";

/**
 * 재사용 가능한 초록 버튼 컴포넌트
 *
 * Props:
 * - children: 버튼 텍스트/아이콘
 * - onClick: 클릭 핸들러
 * - disabled: 버튼 비활성화
 */
export default function GreenButton({ children, onClick, disabled = false, ...rest }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </StyledButton>
  );
}
const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  /* 텍스트 길이에 따라 유동 폭 */
  padding: 12px 20px;
  min-width: 134px; /* 기본 최소 너비 */
  height: 50px; /* 고정 높이 */

  background: var(--primary-1, #0e7400);
  color: var(--text-w1, #fff);

  font-size: var(--fs-lg, 16px);
  font-weight: 500;
  border: 0.5px solid var(--primary-1, #0e7400);
  border-radius: 24px;

  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:active:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    background: var(--natural-0, #fff);
    color: var(--text-1, #000);
    cursor: not-allowed;
  }
`;
