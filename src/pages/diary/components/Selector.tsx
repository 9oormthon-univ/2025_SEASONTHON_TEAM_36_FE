// 오늘 하루 여정을 끝낸 기분 / 오늘 집중도 선택 컴포넌트
import { EmotionBtn, Grid } from "../styles/Selector";

export default function Selector({
  value = null,
  label,
  items,
  onChange,
}: {
  value: number | null;
  label: string;
  items: { id: number; label: string; img: string }[];
  onChange: (item: { id: number; label: string; img: string }) => void;
}) {
  const handleSelect = (item: { id: number; label: string; img: string }) => {
    if (!onChange) return;
    onChange(item); // { id, label, img }
  };

  return (
    <Grid role="radiogroup" aria-label={label}>
      {items.map(e => {
        const active = value === e.id;
        return (
          <EmotionBtn
            key={e.id}
            role="radio"
            aria-checked={active}
            $active={active}
            onClick={() => handleSelect({ id: e.id, label: e.label, img: e.img })}
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
