import img1 from "@/assets/images/frog-face-1.svg";
import img2 from "@/assets/images/frog-face-2.svg";
import img3 from "@/assets/images/frog-face-3.svg";
import img4 from "@/assets/images/frog-face-4.svg";
import img5 from "@/assets/images/frog-face-5.svg";
import styled from "styled-components";

const FOCUSES = [
  { id: 1, label: "산만함", img: img1 },
  { id: 2, label: "살짝집중", img: img2 },
  { id: 3, label: "집중됨", img: img3 },
  { id: 4, label: "몰입", img: img4 },
  { id: 5, label: "초집중", img: img5 },
];

export default function FocusSelector({ value = null, onChange }) {
  const handleSelect = (item) => {
    if (!onChange) return;
    onChange(item); // { id, label }
  };

  return (
    <Grid role="radiogroup" aria-label="집중도 선택">
      {FOCUSES.map((e) => {
        const active = value === e.id;
        return (
          <FocusBtn
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
          </FocusBtn>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  /* 한 줄에 5개 기준, 좁은 화면에서는 자동 줄바꿈 */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
`;

const FocusBtn = styled.button`
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
