// SceneCheckin.tsx
import { useState } from "react";
import styled from "styled-components";

import { WEATHER_ICONS, type WeatherId, WEATHERS } from "@/common/utils/mapWeather";

import GreenButton from "../../../common/components/GreenButton";
import OnbDotSelector from "../components/OnbDotSelector";

export default function SceneCheckin() {
  const [weather, setWeather] = useState<WeatherId | null>(null);
  const [emotion, setEmotion] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);

  return (
    <Container>
      <Header>
        <Title className="typo-h3">오늘의 도약 전</Title>
        <Subtitle>새로운 여정을 떠나기 전 준비를 해봐요.</Subtitle>
      </Header>

      <Section>
        <Question className="typo-h4">오늘의 날씨는 어때요?</Question>
        <ButtonGrid>
          {WEATHERS.map(w => {
            const isActive = weather === w.id;
            const iconSrc = WEATHER_ICONS[w.id][isActive ? "active" : "idle"];
            return (
              <ChoiceButton
                key={w.id}
                type="button"
                onClick={() => setWeather(w.id)}
                aria-pressed={isActive}
              >
                <WeatherIcon>
                  <IconImg
                    style={{ width: "100%", height: "100%" }}
                    src={iconSrc}
                    alt={w.label}
                    draggable={false}
                  />
                </WeatherIcon>
                <Label>{w.label}</Label>
              </ChoiceButton>
            );
          })}
        </ButtonGrid>
      </Section>

      <Section>
        <Question className="typo-h4">지금 감정이 어떤가요?</Question>
        <OnbDotSelector
          name="feeling"
          value={emotion}
          onChange={setEmotion}
          min={1}
          max={5}
          leftLabel="매우 좋지 않음"
          rightLabel="매우 좋음"
        />
      </Section>

      <Section>
        <Question className="typo-h4">여정을 떠날 에너지가 있나요?</Question>
        <OnbDotSelector
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
        <GreenButton disabled={false} onClick={() => {}}>
          START
        </GreenButton>
      </ButtonRow>
    </Container>
  );
}
// --- styles ---
const Container = styled.div`
  padding: 12px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0; /* 내부 스크롤 섹션이 있을 때 레이아웃 안전 */
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 3vh;
  margin-bottom: 2vh;
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
  font-size: 14px;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: var(--ls-2, 0);
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
const WeatherIcon = styled.div`
  width: 37px;
  height: 37px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  transition: all 0.25s ease;
`;
const IconImg = styled.img`
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
