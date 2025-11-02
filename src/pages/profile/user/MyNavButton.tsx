import { useState } from "react";
import styled from "styled-components";

import ProfileImg from "@/assets/images/profile-fill-new.svg";

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
        <img src={ProfileImg} alt="마이 페이지" width="20" height="20" />
      </CircleButton>

      <UserProfileModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ===== Styles ===== */
const CircleButton = styled.button`
  --btn-size: 36px;

  /* 항상 원형 유지 */
  inline-size: var(--btn-size);
  block-size: var(--btn-size);
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  flex: 0 0 auto; /* flex 컨테이너에서 늘어남 방지 */
  display: grid; /* 중앙 정렬 */
  place-items: center;

  padding: 0;
  border: 0.75px solid #969ba5;
  background-color: white;
  color: var(--text-1, #000);
  line-height: 1; /* 텍스트가 높이에 영향 주지 않도록 */
  user-select: none;
  cursor: pointer;

  position: absolute;
  right: 25px;
  top: clamp(24px, calc(24px + (100vh - 667px) * 32 / 229), 56px);

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
