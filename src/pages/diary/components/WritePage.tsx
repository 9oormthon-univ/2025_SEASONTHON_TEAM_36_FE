// 일기 작성 페이지
import { useState } from "react";
import { ErrorResponse, useLocation, useNavigate } from "react-router-dom";

import { createDailyLogAfter } from "@/apis/diaryLog";
import focus_01 from "@/assets/images/frog-face-1.svg";
import focus_05 from "@/assets/images/frog-face-5.svg";
import cafe from "@/assets/images/places/cafe.svg";
import { CompletionLevel, Mood } from "@/common/types/enums";
import { ReqDailyLogAfter } from "@/common/types/request/dailyLog";

import GreenButton from "../../../common/components/GreenButton";
import type { SelectorItem } from "../constants/writeConstants";
import { EMOTIONS, FOCUSES } from "../constants/writeConstants";
import timetable from "../dummyImages/시간표.png";
import { CompletionRow, DateBar, DateText, Label, Page, Section } from "../styles/WritePage";
import { formatKoreanDate } from "../utils/dateUtils";
import ChartWithLegend from "./ChartWithLegend";
import CompletionSelector from "./CompletionSelector";
import BeforeJourney from "./JourneyRow";
import MemoBox from "./MemoBox";
import PhotoPicker from "./PhotoPicker";
import Selector from "./Selector";

// 🐸 id(1~10) → 서버 Mood enum 매핑
const ID_TO_MOOD: Record<number, Mood> = {
  1: "HAPPY", // 즐거웠어
  2: "EXCITED", // 설렜어 (LOVE 이미지는 EXCITED로 매핑)
  3: "CALM", // 평온했어
  4: "NORMAL", // 그저그래
  5: "THRILLING", // 짜릿했어
  6: "FRUSTRATED", // 답답했어
  7: "DEPRESSED", // 우울했어
  8: "EMPTY", // 허무했어
  9: "ANGRY", // 화가났어
  10: "DISAPPOINTED", // 실망했어
};

// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Write() {
  const { state } = useLocation() as { state: string };
  const navigate = useNavigate();

  const goals = [
    { id: 1, name: "LG 전자제품 IMC 기획서 작성", color: "var(--green-200)" },
    { id: 2, name: "총균쇠 독후감 작성하기", color: "var(--green-300)" },
    { id: 3, name: "브랜딩 광고 영상 ppt 만들기", color: "var(--green-400)" },
  ];

  const [mood, setMood] = useState<SelectorItem | null>(null); // 기분
  const [focus, setFocus] = useState<SelectorItem | null>(null); // 집중도
  const [completion, setCompletion] = useState<CompletionLevel>("FIFTY"); // enum 완성도
  const [memo, setMemo] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // 전송 상태
  const [submitting, setSubmitting] = useState(false);

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
      const res = await createDailyLogAfter(body);

      if (typeof res === "string") {
        alert(res || "알 수 없는 오류가 발생했어요.");
        return;
      }
      const maybeErr = res as ErrorResponse;
      if (maybeErr?.status && maybeErr?.statusText) {
        alert(maybeErr.statusText || "저장 중 오류가 발생했어요.");
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
      {/* 추후 실제 api 데이터 연결 */}

      {/* 날짜 바 */}
      <DateBar>
        <DateText className="typo-h3">{formatKoreanDate(new Date(state || new Date()))}</DateText>
      </DateBar>
      {/* 차트 + 범례 */}
      <ChartWithLegend chartSrc={timetable} goals={goals} chartWidthPct={75} />

      <Section>
        <Label className="typo-h4">오늘의 여정을 시작하기 전</Label>
        <BeforeJourney
          items={[
            { title: "감정", imgSrc: focus_05, label: "좋음" },
            { title: "잔여 에너지", imgSrc: focus_01, label: "기운 없음" },
            { title: "장소", imgSrc: cafe, label: "카페" },
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
