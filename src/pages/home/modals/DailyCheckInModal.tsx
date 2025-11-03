import { useMemo, useState } from "react";
import styled from "styled-components";

import { createDailyLogBefore } from "@/apis/diaryLog";

import GreenButton from "../../../common/components/GreenButton";
import PageModal from "../../../common/components/PageModal";
import DotsSelector from "../components/DotsSelector";
import { ModalContainer } from "../styles/ModalContainer";
import DayStartSplash from "./DayStartSplash";

// 위치 후보를 literal type으로 고정
const LOCATIONS = [
  { id: "home", label: "집" },
  { id: "office", label: "직장" },
  { id: "cafe", label: "카페" },
  { id: "library", label: "도서관" },
  { id: "class", label: "강의실" },
  { id: "etc", label: "기타" },
] as const;

type LocationId = (typeof LOCATIONS)[number]["id"];

// 백엔드 enum 문자열 매핑
const PLACE_MAP: Record<LocationId, string> = {
  home: "HOME",
  office: "OFFICE",
  cafe: "CAFE",
  library: "LIBRARY",
  class: "CLASS",
  etc: "ETC",
};

/** ====== 컴포넌트 ====== */
export default function DailyCheckInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: () => void;
}) {
  const [emotion, setEmotion] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [location, setLocation] = useState<LocationId | null>(null);

  // START 클릭 시 띄울 모달 상태
  const [splashOpen, setSplashOpen] = useState<boolean>(false);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const canStart = useMemo(() => location != null && !loading, [location, loading]);

  const onStart = async () => {
    if (!location) return;

    setLoading(true);
    setSubmitError(null);

    const payload = {
      emotion,
      energy,
      place: PLACE_MAP[location],
    };

    const res = await createDailyLogBefore(payload);

    setLoading(false);

    if (typeof res === "string") {
      // apiUtils에서 string으로 에러가 올 수도 있어 가드
      setSubmitError(res || "오류가 발생했습니다.");
      alert(submitError);
      return;
    }
    // if (isErrorResponse(res)) {
    //   setSubmitError(res.message || "요청에 실패했습니다.");
    //   return;
    // }
    // 성공(RespDailyLogBefore)
    // 필요하다면 res를 전역 상태로 보관하거나 analytics 로깅
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
              value={emotion}
              onChange={setEmotion}
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
              {loading ? "STARTING..." : "START"}
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

const ChoiceButton = styled.button<{ $active: boolean }>`
  flex: 1 0 calc(33% - 10px);
  padding: 5% 13px;
  border-radius: 20px;
  border: 1px solid var(--bg-2);
  background: ${({ $active }) => ($active ? "var(--primary-1)" : "var(--natural-200)")};
  color: ${({ $active }) => ($active ? "var(--text-w1)" : "var(--text-1)")};
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
