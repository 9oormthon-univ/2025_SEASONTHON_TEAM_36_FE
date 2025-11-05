// 일기 작성 페이지
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createDailyLogAfter } from "@/apis/diaryLog";
import { CompletionLevel } from "@/common/types/enums";
import { ErrorResponse } from "@/common/types/error";
import { ReqDailyLogAfter } from "@/common/types/request/dailyLog";
import { getWeatherIcons, getWeatherLabelFromEnum } from "@/common/utils/mapWeather";

import GreenButton from "../../../common/components/GreenButton";
import { ENERGY, PREV_EMOTION } from "../constants/readConstants";
import type { SelectorItem } from "../constants/writeConstants";
import { EMOTIONS, FOCUSES } from "../constants/writeConstants";
import useDiaryDetail from "../hooks/useDiaryDetail";
import { CompletionRow, DateBar, DateText, Label, Page, Section } from "../styles/WritePage";
import { formatKoreanDate } from "../utils/dateUtils";
import { ID_TO_MOOD, likert1to5ToIndex, mapTodosToChartGoals } from "../utils/diaryUtils";
import ChartWithLegend from "./ChartWithLegend";
import CompletionSelector from "./CompletionSelector";
import { default as JourneyRow } from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";
import Selector from "./Selector";

export default function Write() {
  const { state } = useLocation() as { state: string };
  console.info(state);
  const date = String(state); // state -> data에 문자열로 저장
  const navigate = useNavigate();

  const { detail, error: loadErr, loading: loadingDetail } = useDiaryDetail(date);

  // 일기 작성 상태
  const [mood, setMood] = useState<SelectorItem | null>(null); // 기분
  const [focus, setFocus] = useState<SelectorItem | null>(null); // 집중도
  const [completion, setCompletion] = useState<CompletionLevel>("FIFTY"); // enum 완성도
  const [memo, setMemo] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // 전송 상태
  const [submitting, setSubmitting] = useState(false);

  if (loadErr) return <div>❌ {loadErr}</div>;
  if (loadingDetail || !detail) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  // ---------- 서버 데이터 → UI 매핑 ----------
  const goals = mapTodosToChartGoals(detail.todayCompletedTodoResponses);

  const prevEmotionIdx = likert1to5ToIndex(detail.emotion, 5);
  const energyIdx = likert1to5ToIndex(detail.energy, 5);
  const weatherIdx = ENUM_TO_WEATHER_ID[detail.weather] ?? 0;

  const headerDate = formatKoreanDate(new Date(state));

  const handleSubmit = async () => {
    if (!mood?.id) return alert("기분을 선택해주세요.");
    if (!focus?.id) return alert("집중도를 선택해주세요.");

    const moodEnum = ID_TO_MOOD[mood.id];
    if (!moodEnum) return alert("선택한 기분 값이 올바르지 않습니다.");

    const focusLevel = focus.id; // 1~5
    if (focusLevel < 1 || focusLevel > 5) return alert("집중도 값이 올바르지 않습니다.");

    const body: ReqDailyLogAfter = {
      mood: moodEnum, // Mood
      focusLevel, // number (1~5)
      completionLevel: completion, // CompletionLevel
      memo: memo.trim() || undefined, // optional
      photoUrl: photoUrl || undefined, // optional
    } as const;
    console.info(body);

    try {
      setSubmitting(true);
      const res = await createDailyLogAfter(body, String(state));

      if (typeof res === "string") {
        alert(res || "알 수 없는 오류가 발생했어요.");
        return;
      }
      const maybeErr = res as ErrorResponse;
      if (maybeErr?.code && maybeErr?.message) {
        alert(maybeErr.message || "저장 중 오류가 발생했어요.");
        return;
      }
      alert("일기가 저장됐어요!");
      void navigate(-1);
    } catch (e) {
      console.error(e);
      alert("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

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

      {/*===== 작성 부분 시작 ===== */}
      {/* 기분 */}
      <Section>
        <Label className="typo-h4">오늘 하루 여정을 끝낸 기분이 어때요?</Label>
        <Selector
          value={mood?.id ?? null}
          label={"기분 선택"}
          items={EMOTIONS}
          onChange={item => setMood(item)} // item = { id, label, img }
        />
      </Section>

      {/* 집중도 */}
      <Section>
        <Label className="typo-h4">오늘 집중도는 어땠나요?</Label>
        <Selector
          value={focus?.id ?? null}
          label={"집중도 선택"}
          items={FOCUSES}
          onChange={item => setFocus(item)} // item = { id(1~5), label, img }
        />
      </Section>

      {/* 완성도 */}
      <Section>
        <Label className="typo-h4">결과물의 완성도를 기록해주세요</Label>
        <CompletionRow>
          <CompletionSelector
            className="typo-label-s"
            name="완성도"
            value={completion}
            onChange={setCompletion}
            leftLabel="0%"
            rightLabel="100%"
          />
        </CompletionRow>
      </Section>

      {/* 메모 */}
      <Section>
        <Label className="typo-h4">MEMO</Label>
        <MemoBox
          value={memo}
          onChange={setMemo}
          maxLength={1000}
          rows={3}
          placeholder="메모"
          readOnly={false}
          showCounter
        />
      </Section>

      {/* 사진 */}
      <Section>
        <Label className="typo-h4">사진</Label>
        <PhotoPicker
          photoUrl={photoUrl}
          onAddClick={() => {
            // TODO: 업로드 모달 열기 / 파일 선택 트리거 등 (UI만 분리, 로직은 나중에)
          }}
          onImageClick={() => {
            // TODO: 확대 보기 / 변경 메뉴 띄우기 등
          }}
        />
        <GreenButton onClick={handleSubmit} disabled={submitting} style={{ margin: " 0 30%" }}>
          작성 완료
        </GreenButton>
      </Section>
    </Page>
  );
}
