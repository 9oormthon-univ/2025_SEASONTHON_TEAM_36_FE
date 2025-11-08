// src/pages/home/styles/DDayIcon.tsx
import styled, { css } from "styled-components";

/** D-Day 값에 따른 배경/텍스트 색 결정 */
function ddayStyles(dDay?: string) {
  const v = String(dDay ?? "").trim();
  const m = /D\s*([+-])?\s*(\d+|day)/i.exec(v);
  if (!m) {
    return css`
      background: #ccc;
    `;
  }

  const sign = m[1]; // "+" | "-" | undefined
  const raw = m[2]?.toLowerCase(); // "1" | "2" | ... | "day"

  // D-DAY (오늘)
  if (raw === "day") {
    return css`
      background: #ff0000;
      color: #fff;
    `;
  }

  const num = Number.parseInt(raw, 10);
  if (Number.isNaN(num)) {
    return css`
      background: #e0e0e0;
    `;
  }

  // D-4 이상 (여유)
  if (sign === "-" && num >= 4) {
    return css`
      background: var(--green-200);
    `;
  }
  // D-3, D-2, D-1
  if (sign === "-" && num === 3) {
    return css`
      background: var(--yellow1);
    `;
  }
  if (sign === "-" && num === 2) {
    return css`
      background: var(--orange);
    `;
  }
  if (sign === "-" && num === 1) {
    return css`
      background: #ff8867;
    `;
  }

  // D+N (마감 지난 목표)
  if (sign === "+") {
    return css`
      // background: #d9d9d9;
      // color: #555;
      background: #ff0000;
      color: #fff;
    `;
  }

  // 기타 기본값
  return css`
    background: #e0e0e0;
  `;
}

export const DDayIcon = styled.div<{ $dDay?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22.5px;
  width: 40px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--text-1);
  font-size: clamp(8px, 2.8vw, 15px);
  font-weight: 400;
  margin-right: 8px;

  ${({ $dDay }) => ddayStyles($dDay)}
`;
