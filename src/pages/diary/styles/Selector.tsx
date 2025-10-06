import styled from "styled-components";

/* ===== styles ===== */
export const Grid = styled.div`
  display: grid;
  /* 한 줄에 5개 기준, 좁은 화면에서는 자동 줄바꿈 */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
`;

export const EmotionBtn = styled.button<{ $active: boolean }>`
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;

  .img-wrap {
    position: relative;
    width: 56px;
    height: 30px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: var(--bg-1);
      transition: border-color 140ms ease;
      display: block;
    }

    /* 선택 안 된 경우 흐리게 오버레이 */
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.6);
      opacity: ${({ $active }) => ($active ? 0 : 1)};
      transition: opacity 140ms ease;
      pointer-events: none;
    }
  }

  span {
    color: var(--text-1, #000);
  }
`;
