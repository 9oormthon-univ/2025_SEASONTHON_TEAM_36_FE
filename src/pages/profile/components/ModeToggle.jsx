import React from "react";
import styled from "styled-components";

/**
 * ModToggle
 * - options: [{ value: string, label: string }]
 * - value: string
 * - onChange: (value) => void
 * - disabled?: boolean
 *
 * 접근성
 * - role="radiogroup" / role="radio"
 * - 키보드: ←/→ 이동, Space/Enter 선택
 *
 * 디자인 토큰
 * - 컨테이너 배경: var(--bg-1, #fff)
 * - 비활성 텍스트: var(--text-2)
 * - 활성 pill 배경: var(--text-1)  (검정에 가까운 톤)
 * - 활성 텍스트: var(--bg-1)       (토큰상 화이트)
 */
export default function ModeToggle({
  options = [],
  value,
  onChange,
  disabled = false,
  className,
  "aria-label": ariaLabel = "옵션 선택",
}) {
  const count = options.length || 1;
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (activeIndex + dir + count) % count;
      onChange?.(options[next].value);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      // 현재 포커스된 radio의 데이터값으로 변경
      const targetVal = e.currentTarget?.dataset?.value;
      if (targetVal != null) onChange?.(targetVal);
    }
  };

  return (
    <Wrap
      className={className}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      data-count={count}
    >
      <Indicator
        aria-hidden="true"
        style={{
          // CSS 변수를 통해 가로 폭/이동 계산
          "--count": count,
          "--idx": activeIndex,
        }}
      />
      {options.map((opt, idx) => {
        const selected = opt.value === value;
        return (
          <OptionBtn
            key={opt.value}
            role="radio"
            aria-checked={selected}
            aria-disabled={disabled}
            data-value={opt.value}
            data-index={idx}
            tabIndex={selected ? 0 : -1}
            $selected={selected}
            disabled={disabled}
            onClick={() => !disabled && onChange?.(opt.value)}
            onKeyDown={handleKeyDown}
          >
            {opt.label}
          </OptionBtn>
        );
      })}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  align-items: stretch;
  gap: 0;
  padding: 3px 6px;
  border-radius: 20px;
background: var(--natural-200, #F1F4F8);
box-shadow: -0.3px -0.3px 5px 0 var(--natural-400, #D6D9E0), 0.3px 0.3px 5px 0 var(--natural-400, #D6D9E0);
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  height: 60px;

`;

const Indicator = styled.span`
  position: absolute;
  inset: 6px;
  border-radius: 20px;
  background: var(--text-1, #000);      /* 검은 pill 배경 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.22);
  width: calc((100% - 12px) / var(--count));
  transform: translateX(calc(var(--idx) * 100%));
  transition: transform 160ms ease, width 160ms ease;
  will-change: transform;
  pointer-events: none;
`;

const OptionBtn = styled.button`
  position: relative;
  z-index: 1; /* Indicator 위에 텍스트가 보이도록 */
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;

  color: ${({ $selected }) =>
    $selected ? "var(--bg-1, #fff)" : "var(--text-2, #9aa0a6)"};
  transition: color 160ms ease, transform 80ms ease;

  &:hover {
    transform: translateY(-0.5px);
  }
  &:active {
    transform: translateY(0.5px) scale(0.99);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
