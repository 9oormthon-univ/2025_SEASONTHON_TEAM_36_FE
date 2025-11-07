// src/pages/diary/components/Read.tsx
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

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
import useDiaryDetail from "../hooks/useDiaryDetail";
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
import ViewPicture from "./ViewPicture";

export default function Read() {
  const { date } = useParams<{ date: string }>();

  const { detail, error: loadErr, loading } = useDiaryDetail(date ?? null);

  // 프리뷰 상태
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleImageClick = useCallback(() => {
    // if (!detail?.photoUrl) return;
    setPreviewOpen(true);
  }, [detail?.photoUrl]);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  if (loadErr) return <div>❌ {loadErr}</div>;
  if (loading || !detail) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  // ---------- 서버 데이터 → UI 매핑 ----------
  const prevEmotionIdx = likert1to5ToIndex(detail.emotion, 5);
  const energyIdx = likert1to5ToIndex(detail.energy, 5);
  const weatherIdx = ENUM_TO_WEATHER_ID[detail.weather] ?? 0;
  const emotionIdx = MOOD_TO_IDX[detail.mood] ?? 0;
  const concentrationIdx = likert1to5ToIndex(detail.focusLevel, 5);

  const perfectionPct = COMPLETION_TO_PERCENT[detail.completionLevel] ?? 0;
  const perfectionIdx = Math.floor(perfectionPct === 100 ? 4 : perfectionPct / 20);

  // 실제 데이터 사용 (권장)
  const goals = mapTodosToChartGoals(detail.todayCompletedTodoResponses);

  // 필요 시 더미 데이터를 잠깐 쓰고 싶다면 위 줄을 주석 처리하고 아래 블록 사용
  /*
  const goals = mapTodosToChartGoals([
    { todoId: 1, todoTitle: "2026학년도 수능 15일 플랜", processTime: "PT3H5M3S", ratio: 0.85 },
    { todoId: 2, todoTitle: "영어 모의고사 풀이 및 오답노트 정리", processTime: "PT1H42M17S", ratio: 0.65 },
    { todoId: 3, todoTitle: "수학 확통 기출 분석 및 개념 복습", processTime: "PT2H28M50S", ratio: 0.9 },
  ]);
  */

  const headerDate = (() => {
    const str = detail.date; // "yyyy-MM-dd"
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
            { title: "완성도", imgSrc: PERFECTION[perfectionIdx], label: `${perfectionPct}%` },
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
          photoUrl={detail.photoUrl ?? "https://picsum.photos/400"}
          onImageClick={handleImageClick}
        />
      </Section>
      <ViewPicture
        open={previewOpen}
        src={detail.photoUrl ?? "https://picsum.photos/400"}
        alt="사진 미리보기"
        onClose={handleClosePreview}
      />
    </Page>
  );
}
