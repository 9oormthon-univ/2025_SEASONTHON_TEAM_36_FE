// DailyCheckInModal.tsx
import { useMemo, useState } from "react";
import styled from "styled-components";

import { createDailyLogBefore } from "@/apis/diaryLog";
import { ErrorResponse } from "@/common/types/error";
import { RespDailyLogBefore } from "@/common/types/response/dailyLog";
import {
  WEATHER_ICONS,
  WEATHER_TO_ENUM,
  type WeatherId,
  WEATHERS,
} from "@/common/utils/mapWeather";

import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import DotsSelector from "../components/DotsSelector";
import DayStartSplash from "../splashes/DayStartSplash";
import { ModalContainer } from "../styles/ModalContainer";

export default function DailyCheckInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  const [weather, setWeather] = useState<WeatherId | null>(null);
  const [emotion, setEmotion] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);

  const [splashOpen, setSplashOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 입력 변경 시 에러 자동 해제
  const handleSelectWeather = (id: WeatherId) => {
    setWeather(id);
    if (submitError) setSubmitError(null);
  };

  const handleChangeEmotion = (v: number) => {
    setEmotion(v);
    if (submitError) setSubmitError(null);
  };

  const handleChangeEnergy = (v: number) => {
    setEnergy(v);
    if (submitError) setSubmitError(null);
  };

  const onStart = async () => {
    if (!weather) return;

    setLoading(true);
    setSubmitError(null);

    const payload = {
      emotion,
      energy,
      weather: WEATHER_TO_ENUM[weather],
    };

    const res: string | RespDailyLogBefore | ErrorResponse = await createDailyLogBefore(payload);
    setLoading(false);

    const maybeErr = res as ErrorResponse;
    if (maybeErr?.code && maybeErr?.message) {
      setSubmitError("오류가 발생했습니다.");
      alert(maybeErr.message || "저장 중 오류가 발생했어요.");
      return;
    }
    if (!res) {
      setSubmitError(res || "오류가 발생했습니다.");
      alert("오류가 발생했습니다. 네트워크 연결을 화인해주세요.");
      return;
    }
    // ③ 성공 (RespDailyLogBefore)
    setSplashOpen(true);
    onClose?.();
  };

  const canStart = useMemo(
    () => weather != null && !loading && !submitError,
    [weather, loading, submitError],
  );

  return (
    <>
      <PageModal open={open} onClose={onClose} hideHeader={true}>
        <ModalContainer $gap="7%">
          <Header>
            <Title className="typo-h2">오늘의 도약 전</Title>
            <Subtitle>새로운 여정을 떠나기 전 준비를 해봐요.</Subtitle>
          </Header>

          <Section>
            <Question className="typo-h3">오늘의 날씨는 어때요?</Question>
            <ButtonGrid>
              {WEATHERS.map(w => {
                const isActive = weather === w.id;
                const iconSrc = WEATHER_ICONS[w.id][isActive ? "active" : "idle"];
                return (
                  <ChoiceButton
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectWeather(w.id)}
                    aria-pressed={isActive}
                  >
                    <WeatherIcon>
                      <IconImg src={iconSrc} alt={w.label} draggable={false} />
                    </WeatherIcon>
                    <Label>{w.label}</Label>
                  </ChoiceButton>
                );
              })}
            </ButtonGrid>
          </Section>

          <Section>
            <Question className="typo-h3">지금 감정이 어떤가요?</Question>
            <DotsSelector
              name="feeling"
              value={emotion}
              onChange={handleChangeEmotion}
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
              onChange={handleChangeEnergy}
              min={1}
              max={5}
              leftLabel="기운 없음"
              rightLabel="에너지 넘침"
            />
          </Section>

          <ButtonRow>
            <GreenButton disabled={!canStart} onClick={onStart}>
              {loading ? "STARTING..." : "START"}
            </GreenButton>
          </ButtonRow>
        </ModalContainer>
      </PageModal>

      <DayStartSplash open={splashOpen} onClose={() => setSplashOpen(false)} />
    </>
  );
}

// --- styles 동일 ---
const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  margin-top: 3vh;
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
const WeatherIcon = styled.div`
  width: 55px;
  height: 55px;
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
