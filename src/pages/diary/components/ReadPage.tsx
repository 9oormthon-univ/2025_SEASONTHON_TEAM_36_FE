// src/pages/diary/components/Read.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchDiaryDetail } from "@/apis/diary";
import type { RespDiaryDetail } from "@/common/types/response/diary";
import {
  ENUM_TO_WEATHER_ID,
  getWeatherIcons,
  getWeatherLabelFromEnum,
} from "@/common/utils/mapWeather";

import {
  CONCENTRATION,
  EMOTION,
  ENERGY,
  PERFECTION,
  PREV_EMOTION,
} from "../constants/readConstants";
import { Label } from "../styles/InfoCard";
import { DateBar, DateText, Page, Section } from "../styles/ReadPage";
import { formatKoreanDate } from "../utils/dateUtils";
import {
  COMPLETION_TO_PERCENT,
  likert1to5ToIndex,
  mapTodosToChartGoals,
  MOOD_TO_IDX,
} from "../utils/diaryUtils";
import ChartWithLegend from "./ChartWithLegend";
import JourneyRow from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";

export default function Read() {
  const { date } = useParams<{ date: string }>();
  const [detail, setDetail] = useState<RespDiaryDetail | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;
    let alive = true;

    void (async () => {
      const res = await fetchDiaryDetail(date);
      if (!alive) return;
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
  }, [date]);

  if (loadErr) return <div>❌ {loadErr}</div>;
  if (!detail) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  // ---------- 서버 데이터 → UI 매핑 ----------
  const prevEmotionIdx = likert1to5ToIndex(detail.emotion, 5);
  const energyIdx = likert1to5ToIndex(detail.energy, 5);
  const weatherIdx = ENUM_TO_WEATHER_ID[detail.weather] ?? 0;
  const emotionIdx = MOOD_TO_IDX[detail.mood] ?? 0;
  const concentrationIdx = likert1to5ToIndex(detail.focusLevel, 5);

  const perfectionPct = COMPLETION_TO_PERCENT[detail.completionLevel] ?? 0;
  const perfectionIdx = Math.floor(perfectionPct === 100 ? 4 : perfectionPct / 20);

  const goals = mapTodosToChartGoals(detail.todayCompletedTodoResponses);

  const headerDate = (() => {
    const str = detail.date;
    const [y, m, d] = str.split("-").map(Number);
    return formatKoreanDate(new Date(y, (m ?? 1) - 1, d ?? 1));
  })();

  return (
    <Page>
      {/* 날짜 바 */}
      <DateBar>
        <DateText className="typo-h3">{headerDate}</DateText>
      </DateBar>

      {/* 실제 파이 차트 + 범례 (터치/클릭 시 상세 시간) */}
      <ChartWithLegend goals={goals} />

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
              title: "날씨",
              // getWeatherIcons가 배열/맵이라면 아래 그대로,
              // 함수라면 getWeatherIcons(weatherIdx).active 로 바꿔주세요.
              imgSrc: getWeatherIcons(weatherIdx)?.active,
              label: getWeatherLabelFromEnum(detail.weather) ?? "",
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
