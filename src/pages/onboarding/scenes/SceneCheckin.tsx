// SceneCheckin.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { WEATHER_ICONS, type WeatherId, WEATHERS } from "@/common/utils/mapWeather";

import OnbDotSelector from "../components/OnbDotSelector";
import type { SceneProps } from "../layout/OnbLayout"; // stage 받아오기

export default function SceneCheckin({ stage }: SceneProps) {
  const [weather, setWeather] = useState<WeatherId | null>(null);
  const [emotion, setEmotion] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);

  const isDayStart = stage?.id === "day-start";

  // === 하이라이트용 참조/좌표 (START 버튼 래퍼 기준) ===
  const containerRef = useRef<HTMLDivElement>(null);
  const startWrapRef = useRef<HTMLDivElement>(null);
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);

  // 버튼 래퍼를 컨테이너 기준 좌표로 변환
  const measure = () => {
    if (!containerRef.current || !startWrapRef.current) {
      setSpotRect(null);
      return;
    }
    const cont = containerRef.current.getBoundingClientRect();
    const wrap = startWrapRef.current.getBoundingClientRect();
    const local = new DOMRect(wrap.left - cont.left, wrap.top - cont.top, wrap.width, wrap.height);
    setSpotRect(local);
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const roContainer = new ResizeObserver(() => measure());
    const roStart = new ResizeObserver(() => measure());
    if (containerRef.current) roContainer.observe(containerRef.current);
    if (startWrapRef.current) roStart.observe(startWrapRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      roContainer.disconnect();
      roStart.disconnect();
    };
  }, []);

  return (
    <Container ref={containerRef}>
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
        {/* GreenButton이 ref를 포워딩하지 않아도 안전하게 측정하도록 래퍼 사용 */}
        <StartBtnWrap ref={startWrapRef}>
          <StyledButton disabled={false} onClick={() => {}}>
            START
          </StyledButton>
        </StartBtnWrap>
      </ButtonRow>

      {/* === START 영역 강조 오버레이: 오직 day-start 단계에서만 === */}
      {isDayStart && (
        <OverlayLayer aria-hidden>
          {spotRect && (
            <>
              <SpotDim $rect={spotRect} $radius={24} />
              <DottedCircle $rect={spotRect} />
              <SpotBubble $rect={spotRect}>클릭</SpotBubble>
            </>
          )}
        </OverlayLayer>
      )}
    </Container>
  );
}
const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  /* 텍스트 길이에 따라 유동 폭 */
  padding: 12px 10px;
  min-width: 124px; /* 기본 최소 너비 */
  height: 40px; /* 고정 높이 */

  background: var(--primary-1, #0e7400);
  color: var(--text-w1, #fff);

  font-size: 14px;
  font-weight: 500;
  border: 0.5px solid var(--primary-1, #0e7400);
  border-radius: 24px;

  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;

  &:disabled {
    background: var(--natural-0, #fff);
    color: var(--text-1, #000);
    cursor: not-allowed;
  }
`;

/* ---------- styles ---------- */
const Container = styled.div`
  position: relative; /* 오버레이 기준 */
  padding: 12px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
`;

const OverlayLayer = styled.div`
  pointer-events: none; /* 클릭 방해 금지 */
  position: absolute;
  inset: 0;
  z-index: 10;
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
  margin-bottom: 14px;
`;

const StartBtnWrap = styled.div`
  display: inline-flex;
`;

/* ===== 재사용 스타일 (OnbLayout.tsx와 동일 정의) ===== */
const DottedCircle = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x + 27}px;
  top: ${p => p.$rect.y - 16}px;
  width: 70px;
  height: 70px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 10;
`;

const SpotBubble = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - 12}px;
  top: ${p => p.$rect.y - 48}px; /* 버튼 위쪽에 말풍선 */
  transform: translateX(-50%);
  width: 58px;
  max-width: 120px;
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 23px 0 23px;
  padding: 12px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  pointer-events: none;
  z-index: 10;
`;
const SpotDim = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: absolute;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;

  /* pill/원형 등 원하는 반경값 */
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : "16px")};

  /* 컨테이너 내부만 투명하고 나머지를 어둡게 */
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.45);

  pointer-events: none;
  z-index: 5;
  transition:
    left 0.06s linear,
    top 0.06s linear,
    width 0.06s linear,
    height 0.06s linear;
`;
