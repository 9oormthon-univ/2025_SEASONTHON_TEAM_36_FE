// src/pages/diary/components/Journey.tsx

import styled from "styled-components";

import { InfoCard } from "./InfoCard";

export interface JourneyItem {
  title: string; // "감정" | "잔여 에너지" | "장소"
  imgSrc: string; // 이미지 경로
  label: string; // 카드 하단 라벨
}

interface JourneyProps {
  items: [JourneyItem, JourneyItem, JourneyItem]; // [emotion, energy, place]
  className?: string; // 필요 시 부모에서 레이아웃 클래스 전달
}

/** 카드 3개 묶음 (레이아웃은 부모가 감싸줌) */
export default function JourneyRow({ items, className }: JourneyProps) {
  const [emotion, energy, place] = items;

  return (
    <div className={className}>
      <Row>
        <InfoCard title={emotion.title} imgSrc={emotion.imgSrc} label={emotion.label} />
        <InfoCard title={energy.title} imgSrc={energy.imgSrc} label={energy.label} />
        <InfoCard title={place.title} imgSrc={place.imgSrc} label={place.label} />
      </Row>
    </div>
  );
}

export const Row = styled.div`
  display: flex;
  justify-content: space-around; /* 균등 분배 */
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;
