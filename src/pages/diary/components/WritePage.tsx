// 일기 작성 페이지 (iOS 지원 / 안전한 업로드 준비 버전)
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createDailyLogAfter } from "@/apis/diaryLog";
import { CompletionLevel } from "@/common/types/enums";
import { ErrorResponse } from "@/common/types/error";
import { ReqDailyLogAfter } from "@/common/types/request/dailyLog";
import { formatKoreanDate } from "@/common/utils/dateUtils";
import {
  ENUM_TO_WEATHER_ID,
  getWeatherIcons,
  getWeatherLabelFromEnum,
} from "@/common/utils/mapWeather";

import GreenButton from "../../../common/components/GreenButton";
import { ENERGY, PREV_EMOTION } from "../constants/readConstants";
import type { SelectorItem } from "../constants/writeConstants";
import { EMOTIONS, FOCUSES } from "../constants/writeConstants";
import useDiaryDetail from "../hooks/useDiaryDetail";
import { useUploadToS3 } from "../hooks/useUploadToS3";
import { CompletionRow, DateBar, DateText, Label, Page, Section } from "../styles/WritePage";
import { ID_TO_MOOD, likert1to5ToIndex, mapTodosToChartGoals } from "../utils/diaryUtils";
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

  // 서버 데이터
  const { detail, error, loading } = useDiaryDetail(date ?? null);

  // 작성 상태
  const [mood, setMood] = useState<SelectorItem | null>(null);
  const [focus, setFocus] = useState<SelectorItem | null>(null);
  const [completion, setCompletion] = useState<CompletionLevel>("FIFTY");
  const [memo, setMemo] = useState("");

  // 사진 상태 (원본 파일 + 프리뷰 URL)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 전송 상태
  const [submitting, setSubmitting] = useState(false);

  // 파일 input & 프리뷰 모달
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // ✅ S3 업로드 훅
  const { upload, uploading, progress, error: uploadError } = useUploadToS3();

  // 컴포넌트 unmount 시 프리뷰 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 날짜 헤더
  const headerDate = formatKoreanDate(new Date(state));

  // 서버 데이터 → UI 매핑(안전 디폴트)
  const prevEmotionIdx = detail ? likert1to5ToIndex(detail.emotion, 5) : 2;
  const energyIdx = detail ? likert1to5ToIndex(detail.energy, 5) : 2;
  const weatherIdx = detail ? (ENUM_TO_WEATHER_ID[detail.weather] ?? 0) : 0;

  const goals = mapTodosToChartGoals(detail?.todayCompletedTodoResponses);

  // 파일 선택 열기 (iOS 카메라 바로 열기: capture="environment"를 input에 지정)
  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 선택 처리
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const file = e.target.files?.[0];
      if (!file) return;

      const MAX_SIZE = 15 * 1024 * 1024; // 15MB
      const mime = (file.type || "").toLowerCase();

      const allowed =
        mime.startsWith("image/") ||
        mime === "image/heic" ||
        mime === "image/heif" ||
        mime === "application/octet-stream";

      if (!allowed) {
        alert("지원하지 않는 이미지 형식이에요.");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("파일이 너무 커요. 15MB 이하 이미지를 선택해주세요.");
        e.target.value = "";
        return;
      }

      // 이전 프리뷰 정리
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const blobUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(blobUrl);
      setPreviewOpen(true);

      // 같은 파일 재선택 가능하도록 리셋
      e.target.value = "";
    },
    [previewUrl],
  );

  const handleImageClick = useCallback(() => {
    if (!previewUrl) return;
    setPreviewOpen(true);
  }, [previewUrl]);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!mood?.id) return alert("기분을 선택해주세요.");
    if (!focus?.id) return alert("집중도를 선택해주세요.");

    const moodEnum = ID_TO_MOOD[mood.id];
    if (!moodEnum) return alert("선택한 기분 값이 올바르지 않습니다.");

    const focusLevel = focus.id;
    if (focusLevel < 1 || focusLevel > 5) return alert("집중도 값이 올바르지 않습니다.");

    setSubmitting(true);
    try {
      // 🔁 사진이 있으면 S3에 업로드 → url을 API의 photoUrl로 사용
      let photoUrlForApi: string | undefined = undefined;
      if (selectedFile) {
        const { url } = await upload(selectedFile); // <-- 핵심 변경
        photoUrlForApi = url;
      }

      const body: ReqDailyLogAfter = {
        mood: moodEnum,
        focusLevel,
        completionLevel: completion,
        memo: memo.trim() || undefined,
        photoUrl: photoUrlForApi,
      } as const;

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
  }, [mood?.id, focus?.id, completion, memo, selectedFile, date, navigate, upload]);

  if (error) return <div>❌ {error}</div>;
  if (loading) return <div style={{ textAlign: "center" }}>불러오는 중...</div>;

  return (
    <Page>
      {/* 날짜 바 */}
      <DateBar>
        <DateText className="typo-h3">{headerDate}</DateText>
      </DateBar>

      {/* 파이 차트 + 범례 */}
      <ChartWithLegend goals={goals} />

      {/* 여정 전 — detail 데이터 */}
      <Section>
        <Label className="typo-h4">오늘의 여정을 시작하기 전</Label>
        {detail ? (
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
                label: detail ? getWeatherLabelFromEnum(detail.weather) : "",
              },
            ]}
          />
        ) : (
          "시작 전 데이터가 없습니다."
        )}
      </Section>

      {/*===== 작성 영역 =====*/}
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

        {/* 숨겨진 파일 입력 (iOS 카메라 즉시 열기) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,image/heic,image/heif"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <PhotoPicker
          photoUrl={previewUrl /* 프리뷰 URL */}
          onAddClick={handleAddClick}
          onImageClick={handleImageClick}
        />

        {/* 진행률/에러 표시 (선택) */}
        {/* {uploading && (
          <div style={{ textAlign: "center", marginTop: 8 }}>업로드 중... {progress}%</div>
        )} */}
        {uploadError && (
          <div style={{ color: "crimson", textAlign: "center" }}>{uploadError.message}</div>
        )}

        <GreenButton
          onClick={handleSubmit}
          disabled={submitting || uploading}
          style={{ margin: " 0 30%" }}
        >
          {submitting ? "저장 중..." : uploading ? `이미지 업로드 중... ${progress}%` : "작성 완료"}
        </GreenButton>
      </Section>

      {/* 풀스크린 프리뷰 */}
      <ViewPicture
        open={previewOpen}
        src={previewUrl ?? undefined}
        alt="사진 미리보기"
        onClose={handleClosePreview}
      />
    </Page>
  );
}
