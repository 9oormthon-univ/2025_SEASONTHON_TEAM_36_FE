import { useState } from "react";
import styled from "styled-components";

import cloudy from "@/assets/images/weathers/cloudy.svg";
import foggy from "@/assets/images/weathers/foggy.svg";
import rainy from "@/assets/images/weathers/rainy.svg";
import snowy from "@/assets/images/weathers/snowy.svg";
import sunny from "@/assets/images/weathers/sunny.svg";

import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import DotsSelector from "../components/DotsSelector";
import { ModalContainer } from "../styles/ModalContainer";
import DayStartSplash from "./DayStartSplash";

const WEATHERS = [
  { id: "sunny", label: "맑음" },
  { id: "cloudy", label: "구름" },
  { id: "rainy", label: "비" },
  { id: "foggy", label: "안개" },
  { id: "snowy", label: "눈" },
] as const;

type WeatherId = (typeof WEATHERS)[number]["id"];

// id → 이미지 매핑
const WEATHER_ICONS: Record<WeatherId, string> = {
  sunny,
  cloudy,
  rainy,
  foggy,
  snowy,
};

export default function DailyCheckInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  const [weather, setWeather] = useState<WeatherId | null>(null);
  const [feeling, setFeeling] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);

  const [splashOpen, setSplashOpen] = useState<boolean>(false);

  const canStart = weather != null;
  const onStart = () => {
    setSplashOpen(true);
    onClose?.();
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
            <Question className="typo-h3">오늘의 날씨는 어때요?</Question>
            <ButtonGrid>
              {WEATHERS.map(w => (
                <ChoiceButton
                  key={w.id}
                  type="button"
                  onClick={() => setWeather(w.id)}
                  aria-pressed={weather === w.id}
                >
                  <WeatherIcon $active={weather === w.id}>
                    <IconImg
                      $active={weather === w.id}
                      src={WEATHER_ICONS[w.id]}
                      alt={w.label}
                      draggable={false}
                    />
                  </WeatherIcon>
                  <Label>{w.label}</Label>
                </ChoiceButton>
              ))}
            </ButtonGrid>
          </Section>

          <Section>
            <Question className="typo-h3">지금 감정이 어떤가요?</Question>
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

/* ===== Styles ===== */
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
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;
  margin-top: 8px;
`;

const ChoiceButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    outline-offset: 3px;
    border-radius: 16px;
  }
`;

/* active 스타일은 여기서만 처리 */
const WeatherIcon = styled.div<{ $active: boolean }>`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "var(--primary-1)" : "var(--natural-200)")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  transition: all 0.25s ease;
`;

const IconImg = styled.img<{ $active: boolean }>`
  user-select: none;
  pointer-events: none;
`;

const Label = styled.span`
  font-size: var(--fs-base);
  font-weight: 500;
  color: var(--text-1);
`;

const ButtonRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;
