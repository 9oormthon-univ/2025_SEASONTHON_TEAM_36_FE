import React, { useState } from "react";
import PageModal from "../../../common/components/PageModal";
import GreenButton from "../../../common/components/GreenButton";
import styled from "styled-components";
/**
 * DailyCheckInModal
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - title: string
 *  - step: { id, title } | null
 *  - isPlaying: boolean
 */
export default function DailyCheckInModal({ open, onClose, title, step, isPlaying }) {
  const [feeling, setFeeling] = useState(5); // 1~10
  const [energy, setEnergy] = useState(5);
  const [location, setLocation] = useState(null);

  const LOCATIONS = [
    { id: "home", label: "🏠 집" },
    { id: "office", label: "🏢 직장" },
    { id: "cafe", label: "☕ 카페" },
    { id: "library", label: "📚 도서관" },
    { id: "class", label: "🏫 강의실" },
    { id: "etc", label: "기타" },
  ];

  return (
    <PageModal
      open={open}
      onClose={onClose}
    >
      <Container>
        <Header>
          <Title>오늘의 도약 전</Title>
          <Subtitle>지금의 마음 상태를 알려주세요 🖤</Subtitle>
        </Header>

        <Section>
          <Question>지금 느끼는 감정은?</Question>
          <RangeBox>
            <RangeInput
              type="range"
              min="1"
              max="10"
              value={feeling}
              onChange={(e) => setFeeling(Number(e.target.value))}
            />
            <RangeLabels>
              <span>매우 좋지 않음</span>
              <span>매우 좋음</span>
            </RangeLabels>
          </RangeBox>
        </Section>

        <Section>
          <Question>지금 나에게 남아있는 에너지는?</Question>
          <RangeBox>
            <RangeInput
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
            />
            <RangeLabels>
              <span>기운 없음</span>
              <span>에너지 넘침</span>
            </RangeLabels>
          </RangeBox>
        </Section>

        <Section>
          <Question>어디에서 일을 진행하나요?</Question>
          <ButtonGrid>
            {LOCATIONS.map((loc) => (
              <ChoiceButton
                key={loc.id}
                type="button"
                $active={location === loc.id}
                onClick={() => setLocation(loc.id)}
              >
                {loc.label}
              </ChoiceButton>
            ))}
          </ButtonGrid>
        </Section>

        <Bottom>
          <GreenButton>START</GreenButton>
        </Bottom>
      </Container>
    </PageModal>
  );
}

const Container = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-1);
  color: var(--text-1);
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 700;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: clamp(12px, 3vw, 14px);
  color: var(--text-2);
`;

const Section = styled.section`
  margin-bottom: 28px;
`;

const Question = styled.h2`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const RangeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: var(--surface-2);
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--brand-1);
    cursor: pointer;
    border: none;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-2);
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ChoiceButton = styled.button`
  flex: 1 0 calc(33% - 10px);
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid var(--surface-2);
  background: ${(p) => (p.$active ? "var(--brand-1)" : "var(--surface-1)")};
  color: ${(p) => (p.$active ? "var(--text-w1)" : "var(--text-1)")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

const Bottom = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;
