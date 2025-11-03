// src/pages/diary/components/Read.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchDiaryDetail } from "@/apis/diary";
import type { CompletionLevel, Mood, Place } from "@/common/types/enums";
import type { RespDiaryDetail } from "@/common/types/response/diary";

import {
  CONCENTRATION,
  EMOTION,
  ENERGY,
  PERFECTION,
  PLACE,
  PREV_EMOTION,
} from "../constants/readConstants";
import timetable from "../dummyImages/시간표.png";
import { Label } from "../styles/InfoCard";
import { DateBar, DateText, Page, Section } from "../styles/ReadPage";
import { formatKoreanDate } from "../utils/dateUtils";
import ChartWithLegend from "./ChartWithLegend";
import JourneyRow from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";

// ---------- 서버 enum → UI 인덱스/퍼센트 매핑 ----------

// Place 매핑
const PLACE_TO_IDX: Record<Place, number> = {
  HOME: 0,
  WORK: 1,
  CAFE: 2,
  LIBRARY: 3,
  CLASSROOM: 4,
  OTHER: 5,
};

// Mood 매핑 (emotion)
const MOOD_TO_IDX: Record<Mood, number> = {
  HAPPY: 0,
  EXCITED: 1,
  CALM: 2,
  NORMAL: 3,
  THRILLING: 4,
  FRUSTRATED: 5,
  DEPRESSED: 6,
  EMPTY: 7,
  ANGRY: 8,
  DISAPPOINTED: 9,
};

// CompletionLevel → 퍼센트
const COMPLETION_TO_PERCENT: Record<CompletionLevel, number> = {
  ZERO: 0,
  TWENTY_FIVE: 25,
  FIFTY: 50,
  SEVENTY_FIVE: 75,
  ONE_HUNDRED: 100,
};

// 1~5 Likert 값을 0-based 인덱스로 변환 + 배열 길이에 맞게 클램프
function likert1to5ToIndex(v: number | null | undefined, arrLen: number) {
  const n = typeof v === "number" ? v : 1; // 기본값 1
  const clamped = Math.min(5, Math.max(1, n)); // 1~5로 클램프
  return Math.min(arrLen - 1, Math.max(0, clamped - 1)); // 0-based로 변환 후 배열 길이로 클램프
}

export default function Read() {
  const { date } = useParams<{ date: string }>();
  const queryDate = date ?? "";

  const [detail, setDetail] = useState<RespDiaryDetail | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    if (!queryDate) return;
    let alive = true;

    void (async () => {
      const res = await fetchDiaryDetail(queryDate);
      if (!alive) return;
      console.info(res);
      if (typeof res === "string") {
        setLoadErr(res || "알 수 없는 오류가 발생했습니다.");
        return;
      }
      if (res && typeof res === "object" && "message" in res) {
        setLoadErr(res.message || "요청에 실패했습니다.");
        return;
      }
      setDetail(res);
    })();

    return () => {
      alive = false;
    };
  }, [queryDate]);

  if (loadErr) return <div>❌ {loadErr}</div>;
  if (!detail) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  // ---------- 서버 데이터 → UI 매핑 ----------
  const prevEmotionIdx = likert1to5ToIndex(detail.emotion, 5);
  const energyIdx = likert1to5ToIndex(detail.energy, 5);
  const placeIdx = PLACE_TO_IDX[detail.place] ?? 0;
  const emotionIdx = MOOD_TO_IDX[detail.mood] ?? 0;
  const concentrationIdx = likert1to5ToIndex(detail.focusLevel, 5);

  const perfectionPct = COMPLETION_TO_PERCENT[detail.completionLevel] ?? 0;
  const perfectionIdx = Math.floor(perfectionPct === 100 ? 4 : perfectionPct / 20);

  // 🐸 추후 수정: 통계 컴포넌트 참고해서 실제 값 전달 예정
  const goals = [
    { id: 1, name: "LG 전자제품 IMC 기획서 작성", color: "var(--green-200)" },
    { id: 2, name: "총균쇠 독후감 작성하기", color: "var(--green-300)" },
    { id: 3, name: "브랜딩 광고 영상 ppt 만들기", color: "var(--green-400)" },
  ];

  const headerDate = (() => {
    const str = detail.date;
    if (!str) return formatKoreanDate(new Date());
    const [y, m, d] = str.split("-").map(Number);
    return formatKoreanDate(new Date(y, (m ?? 1) - 1, d ?? 1));
  })();

  return (
    <Page>
      {/* 날짜 바 */}
      <DateBar>
        <DateText>{headerDate}</DateText>
      </DateBar>

      {/* 차트 + 범례 🐸 */}
      <ChartWithLegend chartSrc={timetable} goals={goals} chartWidthPct={75} />

      {/* 여정 전 */}
      <Section>
        <Label className="typo-h4">오늘의 여정을 시작하기 전</Label>
        <JourneyRow
          items={[
            {
              title: "감정",
              imgSrc: PREV_EMOTION[prevEmotionIdx]?.img,
              label: PREV_EMOTION[prevEmotionIdx]?.text ?? "",
            },
            {
              title: "잔여 에너지",
              imgSrc: ENERGY[energyIdx]?.img,
              label: ENERGY[energyIdx]?.text ?? "",
            },
            {
              title: "장소",
              imgSrc: PLACE[placeIdx]?.img,
              label: PLACE[placeIdx]?.text ?? "",
            },
          ]}
        />
      </Section>

      {/* 여정 후 */}
      <Section>
        <Label className="typo-h4">오늘의 여정을 끝낸 후</Label>
        <JourneyRow
          items={[
            {
              title: "기분",
              imgSrc: EMOTION[emotionIdx]?.img,
              label: EMOTION[emotionIdx]?.text ?? "",
            },
            {
              title: "집중도",
              imgSrc: CONCENTRATION[concentrationIdx]?.img,
              label: CONCENTRATION[concentrationIdx]?.text ?? "",
            },
            {
              title: "완성도",
              imgSrc: PERFECTION[perfectionIdx],
              label: `${perfectionPct}%`,
            },
          ]}
        />
      </Section>

      {/* 메모 */}
      <Section>
        <Label className="typo-h4">MEMO</Label>
        <MemoBox
          value={detail.memo ?? ""}
          placeholder="메모"
          readOnly
          showCounter={false}
          rows={3}
        />
      </Section>

      {/* 사진 */}
      <Section>
        <Label className="typo-h4">사진</Label>
        <PhotoPicker
          photoUrl={detail.photoUrl ?? ""}
          onImageClick={() => {
            /* 확대 보기 등 */
          }}
        />
      </Section>
    </Page>
  );
}
