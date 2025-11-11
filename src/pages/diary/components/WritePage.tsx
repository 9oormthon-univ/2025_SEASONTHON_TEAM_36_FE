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
import { CompletionRow, DateBar, DateText, Label, Page, Section } from "../styles/WritePage";
import { ID_TO_MOOD, likert1to5ToIndex, mapTodosToChartGoals } from "../utils/diaryUtils";
import ChartWithLegend from "./ChartWithLegend";
import CompletionSelector from "./CompletionSelector";
import { default as JourneyRow } from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";
import Selector from "./Selector";
import ViewPicture from "./ViewPicture";

// ===== 이미지 헬퍼: 파일 → 리사이즈된 DataURL(JPEG/WebP) =====
async function fileToResizedDataUrl(
  file: File,
  opts: { maxSize: number; quality: number; prefer: "image/webp" | "image/jpeg" } = {
    maxSize: 2048, // 긴 변 기준
    quality: 0.85,
    prefer: "image/jpeg",
  },
): Promise<string> {
  // 브라우저가 디코드 못하면(예: 일부 환경의 HEIC) 예외 발생 → 상위에서 폴백
  const arrayBuf = await file.arrayBuffer();
  const blob = new Blob([arrayBuf], { type: file.type || "application/octet-stream" });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      // iOS 사파리 CORS 문제 회피를 위해 same-origin 가정. 필요시 crossOrigin 설정.
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = objectUrl;
    });

    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) throw new Error("Invalid image dimension");

    const scale = Math.min(1, opts.maxSize / Math.max(w, h));
    const targetW = Math.round(w * scale);
    const targetH = Math.round(h * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    // 간단한 고품질 보간
    (ctx as any).imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // WebP가 더 작고 좋지만, 사파리 구버전 호환을 위해 JPEG 우선 옵션도 지원
    const targetType = opts.prefer;
    // 일부 브라우저는 toDataURL의 MIME을 무시하고 기본값으로 반환할 수 있음
    const dataUrl = canvas.toDataURL(targetType, opts.quality);

    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

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

      // 타입/용량 검증 (HEIC/HEIF도 일단 허용: 브라우저 디코딩 실패 시 폴백)
      const allowed =
        mime.startsWith("image/") ||
        mime === "image/heic" ||
        mime === "image/heif" ||
        mime === "application/octet-stream"; // 일부 iOS가 빈 타입 줄 때

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
      // ===== 이미지 처리 전략 =====
      // 백엔드가 문자열 필드 photoUrl만 받으므로
      // - 가능하면 클라이언트에서 리사이즈+JPEG/WebP DataURL로 변환해 전달합니다.
      // - 브라우저가 디코딩 못하면(HEIC 등) 프리뷰 blob URL로 폴백 (권장X, 추후 업로드 API로 교체).
      let photoUrlForApi: string | undefined = undefined;

      if (selectedFile) {
        try {
          // 사파리 포함 대다수 브라우저 호환을 위해 JPEG 권장
          photoUrlForApi = await fileToResizedDataUrl(selectedFile, {
            maxSize: 2048,
            quality: 0.85,
            prefer: "image/jpeg",
          });
        } catch (err) {
          // 디코딩 실패(HEIC 미지원 등) → 폴백: 일단 blob/objectURL 사용
          // ⚠️ 서버가 blob URL을 읽을 수는 없으니, 실제 운영에서는 CDN 사전 업로드로 교체 필요
          if (previewUrl) {
            photoUrlForApi = previewUrl;
          }
        }
      }

      const body: ReqDailyLogAfter = {
        mood: moodEnum,
        focusLevel,
        completionLevel: completion,
        memo: memo.trim() || undefined,
        photoUrl: photoUrlForApi, // DataURL(권장) 또는 임시 폴백
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
  }, [mood?.id, focus?.id, completion, memo, selectedFile, previewUrl, date, navigate]);

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

        <GreenButton onClick={handleSubmit} disabled={submitting} style={{ margin: " 0 30%" }}>
          작성 완료
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
