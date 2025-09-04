import React, { useState } from "react";
import PageModal from "../../../common/components/PageModal";
import GreenButton from "../../../common/components/GreenButton";
import styled from "styled-components";
import { ModalContainer } from "../styles/ModalContainer";
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
    { id: "home", label: "집" },
    { id: "office", label: "직장" },
    { id: "cafe", label: "카페" },
    { id: "library", label: "도서관" },
    { id: "class", label: "강의실" },
    { id: "etc", label: "기타" },
  ];

  return (
    <PageModal
      open={open}
      onClose={onClose}
    >
      <ModalContainer>
        <Header>
          <Title className="typo-h2">오늘의 도약 전</Title>
          <Subtitle>지금의 마음 상태를 알려주세요 🖤</Subtitle>
        </Header>

        <Section>
          <Question className="typo-h3">지금 느끼는 감정은?</Question>
          <RangeBox>
            <RangeInput
              type="range"
              min="1"
              max="10"
              value={feeling}
              onChange={(e) => setFeeling(Number(e.target.value))}
            />
            <RangeLabels className="typo-label-s">
              <span>매우 좋지 않음</span>
              <span>매우 좋음</span>
            </RangeLabels>
          </RangeBox>
        </Section>

        <Section>
          <Question className="typo-h3">지금 나의 에너지는?</Question>
          <RangeBox>
            <RangeInput
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
            />
            <RangeLabels className="typo-label-s">
              <span>기운 없음</span>
              <span>에너지 넘침</span>
            </RangeLabels>
          </RangeBox>
        </Section>

        <Section>
          <Question className="typo-h3">어디에서 일을 진행하나요?</Question>
          <ButtonGrid>
            {LOCATIONS.map((loc) => (
              <ChoiceButton
              className="typo-label-l"
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
          <GreenButton disabled={!location}>START</GreenButton>
        </Bottom>
      </ModalContainer>
    </PageModal>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const Title = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: var(--text-1, #000);
`;

const Subtitle = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: var(--text-2);
  font-size: var(--fs-lg, 16px);
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 16px */
  letter-spacing: var(--ls-2, 0);
`;

const Section = styled.section`
    display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const Question = styled.h3`
  color: var(--text-1, #000);
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
  color: var(--text-1);
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

const ChoiceButton = styled.button`
  flex: 1 0 calc(33% - 10px);
  padding: 5% 13px;
  border-radius: 20px;
  border: 1px solid var(--surface-2);
  background: ${(p) => (p.$active ? "var(--primary-1)" : "var(--natural-200)")};
  color: ${(p) => (p.$active ? "var(--text-w1)" : "var(--text-1)")};
  cursor: pointer;
  transition: all 0.2s;
`;

const Bottom = styled.div`
  margin-top: auto;
  margin-bottom: 3vh;
  display: flex;
  justify-content: center;
`;
