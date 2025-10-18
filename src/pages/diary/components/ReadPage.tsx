// 일기 작성 페이지
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import picture from "@/assets/images/default.png";

import { CONCENTRATION, ENERGY, PERFECTION, PLACE, PREV_EMOTION } from "../constants/readConstants";
import timetable from "../dummyImages/시간표.png";
import { Label } from "../styles/InfoCard";
import {
  ChartBox,
  ColorDot,
  DateBar,
  DateText,
  Legend,
  LegendItem,
  LegendLeft,
  MemoFieldWrap,
  MemoInput,
  Page,
  PhotoBox,
  Placeholder,
  Section,
} from "../styles/ReadPage";
import { Diary } from "../types/Diary";
import { formatKoreanDate } from "../utils/dateUtils";
import JourneyRow from "./JourneyRow";

export const CircleChart = styled.img.attrs({ src: timetable, alt: "시간표" })`
  object-fit: cover;
  width: 75%;
`;

// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Read() {
  const { state } = useLocation() as { state: Diary };

  const goals = [
    { id: 1, name: "LG 전자제품 IMC 기획서 작성", color: "var(--green-200)" },
    { id: 2, name: "총균쇠 독후감 작성하기", color: "var(--green-300)" },
    { id: 3, name: "브랜딩 광고 영상 ppt 만들기", color: "var(--green-400)" },
  ];

  const photoUrl = null; // URL or null

  return (
    <Page>
      {/* 날짜 바 */}
      <DateBar>
        <DateText>{formatKoreanDate(new Date(state.date || new Date()))}</DateText>
      </DateBar>
      {/* 차트 + 범례 */}
      <ChartBox>
        <CircleChart />
      </ChartBox>
      <Legend>
        {goals.map(g => (
          <LegendItem key={g.id}>
            <LegendLeft>
              <ColorDot style={{ background: g.color }} />
              <span>{g.name}</span>
            </LegendLeft>
            {/* <LegendRight className="typo-label-l">{g.note ?? "—"}</LegendRight> */}
          </LegendItem>
        ))}
      </Legend>
      <Section>
        <Label>오늘의 여정을 시작하기 전</Label>
        <JourneyRow
          items={[
            {
              title: "감정",
              imgSrc: PREV_EMOTION[state.prevEmotion].img,
              label: PREV_EMOTION[state.prevEmotion].text,
            },
            {
              title: "잔여 에너지",
              imgSrc: ENERGY[state.energy].img,
              label: ENERGY[state.energy].text,
            },
            {
              title: "장소",
              imgSrc: PLACE[state.place].img,
              label: PLACE[state.place].text,
            },
          ]}
        />
      </Section>

      <Section>
        <Label>오늘의 여정을 끝낸 후</Label>
        <JourneyRow
          items={[
            {
              title: "감정",
              imgSrc: PREV_EMOTION[state.prevEmotion].img,
              label: PREV_EMOTION[state.prevEmotion].text,
            },
            {
              title: "집중도",
              imgSrc: CONCENTRATION[state.concentration].img,
              label: CONCENTRATION[state.concentration].text,
            },
            {
              title: "완성도",
              imgSrc: PERFECTION[Math.floor(state.perfection === 100 ? 4 : state.perfection / 20)],
              label: `${state.perfection}%`,
            },
          ]}
        />
      </Section>

      {/* 메모 */}
      <Section>
        <Label>MEMO</Label>
        <MemoFieldWrap>
          <MemoInput value={`${state.memo}`} placeholder="메모" readOnly rows={3} />
        </MemoFieldWrap>
      </Section>

      {/* 사진 */}
      <Section>
        <Label>사진</Label>
        <PhotoBox>
          {photoUrl ? (
            <img src={photoUrl} alt="기록 사진" />
          ) : (
            <Placeholder>
              <img src={picture} alt="추가" />
            </Placeholder>
          )}
        </PhotoBox>
      </Section>
    </Page>
  );
}
