import { useState } from "react";
import styled from "styled-components";

import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import DotsSelector from "../components/DotsSelector";
import { ModalContainer } from "../styles/ModalContainer";
import DayStartSplash from "./DayStartSplash";

export default function DailyCheckInModal({ open, onClose }) {
  const [feeling, setFeeling] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [location, setLocation] = useState(null);

  // START 클릭 시 띄울 모달 상태
  const [splashOpen, setSplashOpen] = useState(false);

  const LOCATIONS = [
    { id: "home", label: "집" },
    { id: "office", label: "직장" },
    { id: "cafe", label: "카페" },
    { id: "library", label: "도서관" },
    { id: "class", label: "강의실" },
    { id: "etc", label: "기타" },
  ];

  const canStart = location != null;
  const onStart = () => {
    // if (!canStart) return;
    setSplashOpen(true);
    onClose?.(); // 현재 모달은 닫기
  };

  return (
    <>
      <PageModal open={open} onClose={onClose}>
        <ModalContainer $gap="7%">
          <Header>
            <Title className="typo-h2">오늘의 도약 전</Title>
            <Subtitle>새로운 여정을 떠나기 전 준비를 해봐요.</Subtitle>
          </Header>

          <Section>
            <Question className="typo-h3">지금 느끼는 감정이 어떤가요?</Question>
            <DotsSelector
              name="feeling"
              value={feeling}
              onChange={setFeeling}
              min={1}
              max={5}
              leftLabel="매우 좋지 않음"
              rightLabel="매우 좋음"
            />
          </Section>

          <Section>
            <Question className="typo-h3">여정을 떠날 에너지가 있나요?</Question>
            <DotsSelector
              name="energy"
              value={energy}
              onChange={setEnergy}
              min={1}
              max={5}
              leftLabel="기운 없음"
              rightLabel="에너지 넘침"
            />
          </Section>

          <Section>
            <Question className="typo-h3">오늘의 여정은 어디서 진행되나요?</Question>
            <ButtonGrid>
              {LOCATIONS.map(loc => (
                <ChoiceButton
                  className="typo-label-l"
                  key={loc.id}
                  type="button"
                  $active={location === loc.id}
                  onClick={() => setLocation(loc.id)}
                  aria-pressed={location === loc.id}
                >
                  {loc.label}
                </ChoiceButton>
              ))}
            </ButtonGrid>
          </Section>
          <ButtonRow>
            <GreenButton disabled={!canStart} onClick={onStart}>
              START
            </GreenButton>
          </ButtonRow>
        </ModalContainer>
      </PageModal>

      <DayStartSplash open={splashOpen} onClose={() => setSplashOpen(false)} />
    </>
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
  font-weight: 500;
  line-height: 100%;
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

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

const ChoiceButton = styled.button`
  flex: 1 0 calc(33% - 10px);
  padding: 5% 13px;
  border-radius: 20px;
  border: 1px solid var(--bg-2);
  background: ${p => (p.$active ? "var(--primary-1)" : "var(--natural-200)")};
  color: ${p => (p.$active ? "var(--text-w1)" : "var(--text-1)")};
  cursor: pointer;
  transition: all 0.2s;

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    outline-offset: 2px;
  }
`;

const ButtonRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;
