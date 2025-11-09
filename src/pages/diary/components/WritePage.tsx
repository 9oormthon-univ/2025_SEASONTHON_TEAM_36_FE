// 일기 작성 페이지
import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createDailyLogAfter } from "@/apis/diaryLog";
import { CompletionLevel } from "@/common/types/enums";
import { ErrorResponse } from "@/common/types/error";
import { ReqDailyLogAfter } from "@/common/types/request/dailyLog";
import { formatKoreanDate } from "@/common/utils/dateUtils";
import {
  ENUM_TO_WEATHER_ID, // ⬅️ 추가
  getWeatherIcons,
  getWeatherLabelFromEnum,
} from "@/common/utils/mapWeather";

import GreenButton from "../../../common/components/GreenButton";
import { ENERGY, PREV_EMOTION } from "../constants/readConstants";
import type { SelectorItem } from "../constants/writeConstants";
import { EMOTIONS, FOCUSES } from "../constants/writeConstants";
// import useDiaryDetail from "../hooks/useDiaryDetail";  // ⛔️ 제거
import useWriteDetail from "../hooks/useWriteDetail"; // ⬅️ 추가
import { CompletionRow, DateBar, DateText, Label, Page, Section } from "../styles/WritePage";
import { ID_TO_MOOD, likert1to5ToIndex } from "../utils/diaryUtils"; // ⬅️ mapTodosToChartGoals 제거
import ChartWithLegend from "./ChartWithLegend";
import CompletionSelector from "./CompletionSelector";
import { default as JourneyRow } from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";
import Selector from "./Selector";
import ViewPicture from "./ViewPicture";

export default function Write() {
  const { state } = useLocation() as { state: string };
  const date = String(state);
  const navigate = useNavigate();

  // ⬇️ 새 훅 사용: before(감정/에너지/날씨), goals(완료 투두), 로딩/에러
  const { before, goals, loading, error } = useWriteDetail(date);

  // 일기 작성 상태
  const [mood, setMood] = useState<SelectorItem | null>(null);
  const [focus, setFocus] = useState<SelectorItem | null>(null);
  const [completion, setCompletion] = useState<CompletionLevel>("FIFTY");
  const [memo, setMemo] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // 전송 상태
  const [submitting, setSubmitting] = useState(false);

  // 사진 관련
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 프리뷰
  const [previewOpen, setPreviewOpen] = useState(false);

  // 파일 선택 트리거
  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 선택 후 미리보기용 URL 생성
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일을 선택해 주세요.");
        e.target.value = "";
        return;
      }
      if (photoUrl && photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
      const blobUrl = URL.createObjectURL(file);
      setPhotoUrl(blobUrl);
      setPreviewOpen(true);
    },
    [photoUrl],
  );

  // 썸네일 클릭 시 프리뷰 열기
  const handleImageClick = useCallback(() => {
    if (!photoUrl) return;
    setPreviewOpen(true);
  }, [photoUrl]);

  // 프리뷰 닫기
  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  if (error) return <div>❌ {error}</div>;
  if (loading) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  // ---------- 서버 데이터 → UI 매핑 ----------
  // before가 null일 수도 있으니 안전하게 인덱스 계산 (기본값 중립)
  const prevEmotionIdx = before ? likert1to5ToIndex(before.emotion, 5) : 2;
  const energyIdx = before ? likert1to5ToIndex(before.energy, 5) : 2;
  const weatherIdx = before ? (ENUM_TO_WEATHER_ID[before.weather] ?? 0) : 0;

  const headerDate = formatKoreanDate(new Date(state));

  const handleSubmit = async () => {
    if (!mood?.id) return alert("기분을 선택해주세요.");
    if (!focus?.id) return alert("집중도를 선택해주세요.");

    const moodEnum = ID_TO_MOOD[mood.id];
    if (!moodEnum) return alert("선택한 기분 값이 올바르지 않습니다.");

    const focusLevel = focus.id; // 1~5
    if (focusLevel < 1 || focusLevel > 5) return alert("집중도 값이 올바르지 않습니다.");

    const body: ReqDailyLogAfter = {
      mood: moodEnum,
      focusLevel,
      completionLevel: completion,
      memo: memo.trim() || undefined,
      photoUrl: photoUrl || undefined,
    } as const;

    try {
      setSubmitting(true);
      const res = await createDailyLogAfter(body, date);

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

      {/* 실제 파이 차트 + 범례 (완료 투두에서 계산된 goals 사용) */}
      <ChartWithLegend goals={goals} />

      {/* 여정 전 — DailyLogBefore 기반(없으면 빈 값) */}
      <Section>
        <Label className="typo-h4">오늘의 여정을 시작하기 전</Label>
        {before ? (
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
                label: before ? getWeatherLabelFromEnum(before.weather) : "",
              },
            ]}
          />
        ) : (
          "시작 전 데이터가 없습니다."
        )}
      </Section>

      {/*===== 작성 부분 시작 ===== */}
      {/* 기분 */}
      <Section>
        <Label className="typo-h4">오늘 하루 여정을 끝낸 기분이 어때요?</Label>
        <Selector
          value={mood?.id ?? null}
          label={"기분 선택"}
          items={EMOTIONS}
          onChange={item => setMood(item)}
        />
      </Section>

      {/* 집중도 */}
      <Section>
        <Label className="typo-h4">오늘 집중도는 어땠나요?</Label>
        <Selector
          value={focus?.id ?? null}
          label={"집중도 선택"}
          items={FOCUSES}
          onChange={item => setFocus(item)}
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

        {/* 숨겨진 파일 입력 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <PhotoPicker
          photoUrl={photoUrl}
          onAddClick={handleAddClick}
          onImageClick={handleImageClick}
        />

        <GreenButton onClick={handleSubmit} disabled={submitting} style={{ margin: " 0 30%" }}>
          작성 완료
        </GreenButton>
      </Section>

      {/* 풀스크린 프리뷰 */}
      <ViewPicture
        open={previewOpen}
        src={photoUrl ?? undefined}
        alt="사진 미리보기"
        onClose={handleClosePreview}
      />
    </Page>
  );
}
