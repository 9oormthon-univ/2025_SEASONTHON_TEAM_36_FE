// 일기 작성 페이지
import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import focus_01 from "@/assets/images/frog-face-1.svg";
import focus_05 from "@/assets/images/frog-face-5.svg";
import cafe from "@/assets/images/places/cafe.svg";

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

const CircleChart = styled.img.attrs({ src: timetable, alt: "시간표" })`
  object-fit: cover;
  width: 75%;
`;

// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Write() {
  const { state } = useLocation() as { state: string };

  const goals = [
    { id: 1, name: "LG 전자제품 IMC 기획서 작성", color: "var(--green-200)" },
    { id: 2, name: "총균쇠 독후감 작성하기", color: "var(--green-300)" },
    { id: 3, name: "브랜딩 광고 영상 ppt 만들기", color: "var(--green-400)" },
  ];

  const photoUrl = null; // URL or null

  const [memo, setMemo] = React.useState("");
  const [emotion, setEmotion] = React.useState<SelectorItem | null>(null); // { id, label } 형태로 받을 예정
  const [focus, setFocus] = React.useState<SelectorItem | null>(null); // { id, label }
  const [completion, setCompletion] = React.useState(3); // 1~5 점

  return (
    <Page>
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

      {/* 감정 */}
      <Section>
        <Label className="typo-h4">오늘 하루 여정을 끝낸 기분이 어때요?</Label>
        <Selector
          value={emotion?.id ?? null}
          label={"감정 선택"}
          items={EMOTIONS}
          onChange={item => setEmotion(item)} // item = { id, label }
        />
      </Section>

      {/* 집중도 */}
      <Section>
        <Label className="typo-h4">오늘 집중도는 어땠나요?</Label>
        <Selector
          value={focus?.id ?? null}
          label={"집중도 선택"}
          items={FOCUSES}
          onChange={item => setFocus(item)} // { id, label }
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
            min={1}
            max={5}
            leftLabel="0%"
            rightLabel="100%"
          />
          {/* <Percent className="typo-body-s">{completion * 20}%</Percent> */}
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
        <GreenButton onClick={() => {}} style={{ margin: " 0 30%" }}>
          작성 완료
        </GreenButton>
      </Section>
    </Page>
  );
}
