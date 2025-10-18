import styled, { css } from "styled-components";

export interface MemoBoxProps {
  value: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
  /** 읽기 전용 화면 등에서 카운터 숨김 */
  showCounter?: boolean;
  className?: string;
}

export default function MemoBox({
  value,
  onChange,
  maxLength = 1000,
  rows = 3,
  placeholder = "메모",
  readOnly = false,
  showCounter = true,
  className,
}: MemoBoxProps) {
  return (
    <MemoFieldWrap className={className} $readOnly={readOnly}>
      <MemoInput
        value={value}
        onChange={e => onChange?.(e.target.value)}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {showCounter && !readOnly && (
        <InlineCounter className="typo-body-xs">
          {value.length}/{maxLength}
        </InlineCounter>
      )}
    </MemoFieldWrap>
  );
}

export const MemoFieldWrap = styled.div<{ $readOnly?: boolean }>`
  position: relative;
  padding: 6px 0 10px;
  border-bottom: 1px solid var(--natural-400);
  transition: border-color 150ms ease;

  /* 읽기 전용이 아닐 때만 포커스 시 색상 변경 */
  ${({ $readOnly }) =>
    !$readOnly &&
    css`
      &:focus-within {
        border-bottom-color: var(--primary-1);
      }
    `}

  /* 읽기 전용일 때는 포인터·포커스 이벤트 차단 */
  ${({ $readOnly }) =>
    $readOnly &&
    css`
      pointer-events: none; /* 클릭 시 포커스 안 잡힘 */
      user-select: none; /* 텍스트 선택 방지 (필요 시 제거 가능) */
    `}
`;

export const MemoInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-family: var(--ff-sans);
  font-size: var(--fs-sm);
  line-height: 1.4;
  resize: none;
  box-sizing: border-box;
  padding-right: 56px;
  -webkit-text-size-adjust: 100%;

  ::placeholder {
    color: var(--text-3);
  }

  /* readOnly일 때 커서 숨김 (모바일 iOS에서도 포커스 안 생김) */
  &:read-only {
    caret-color: transparent;
  }
`;

export const InlineCounter = styled.div`
  position: absolute;
  right: 0;
  bottom: 10px;
  color: var(--text-3);
`;
