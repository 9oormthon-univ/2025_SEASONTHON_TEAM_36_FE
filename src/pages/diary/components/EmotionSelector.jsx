import styled from "styled-components";

import img9 from "@/assets/images/emotions/angry.svg";
import img7 from "@/assets/images/emotions/blue.svg";
import img10 from "@/assets/images/emotions/disappointed.svg";
import img5 from "@/assets/images/emotions/excited.svg";
import img6 from "@/assets/images/emotions/frustrated.svg";
import img8 from "@/assets/images/emotions/hollow.svg";
import img1 from "@/assets/images/emotions/joy.svg";
import img2 from "@/assets/images/emotions/love.svg";
import img3 from "@/assets/images/emotions/peace.svg";
import img4 from "@/assets/images/emotions/soso.svg";

const EMOTIONS = [
  { id: 1, label: "즐거웠어", img: img1 },
  { id: 2, label: "설렜어", img: img2 },
  { id: 3, label: "평온했어", img: img3 },
  { id: 4, label: "그저그래", img: img4 },
  { id: 5, label: "짜릿했어", img: img5 },
  { id: 6, label: "답답했어", img: img6 },
  { id: 7, label: "우울했어", img: img7 },
  { id: 8, label: "허무했어", img: img8 },
  { id: 9, label: "화가났어", img: img9 },
  { id: 10, label: "실망했어", img: img10 },
];

export default function EmotionSelector({ value = null, onChange }) {
  const handleSelect = (item) => {
    if (!onChange) return;
    onChange(item); // { id, label }
  };

  return (
    <Grid role="radiogroup" aria-label="감정 선택">
      {EMOTIONS.map((e) => {
        const active = value === e.id;
        return (
          <EmotionBtn
            key={e.id}
            role="radio"
            aria-checked={active}
            $active={active}
            onClick={() => handleSelect({ id: e.id, label: e.label })}
          >
            <div className="img-wrap">
              <img src={e.img} alt={e.label} />
            </div>
            <span className="typo-body-xs">{e.label}</span>
          </EmotionBtn>
        );
      })}
    </Grid>
  );
}

/* ===== styles ===== */
const Grid = styled.div`
  display: grid;
  /* 한 줄에 5개 기준, 좁은 화면에서는 자동 줄바꿈 */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
`;

const EmotionBtn = styled.button`
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
