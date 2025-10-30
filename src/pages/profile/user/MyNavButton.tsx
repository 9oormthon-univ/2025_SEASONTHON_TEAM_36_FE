import { useState } from "react";
import styled from "styled-components";

import UserProfileModal from "./UserProfileModal";

export default function MyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CircleButton
        className="typo-xs"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="마이 페이지"
      >
        MY
      </CircleButton>

      <UserProfileModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ===== Styles ===== */
const CircleButton = styled.button`
  --btn-size: 48px;

  /* 항상 원형 유지 */
  inline-size: var(--btn-size);
  block-size: var(--btn-size);
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  flex: 0 0 auto; /* flex 컨테이너에서 늘어남 방지 */
  display: grid; /* 중앙 정렬 */
  place-items: center;

  padding: 0;
  border: none;
  background-color: var(--natural-200);
  color: var(--text-1, #000);
  line-height: 1; /* 텍스트가 높이에 영향 주지 않도록 */
  user-select: none;
  cursor: pointer;

  /* 쉐도우 정상 적용 (콤마로 다중 쉐도우) */
  box-shadow:
    0.3px 0.3px 5px var(--natural-400, #d6d9e0),
    -0.3px -0.3px 5px var(--natural-400, #d6d9e0);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  }
`;
