// 일기 작성 페이지
import React from "react";
import styled from "styled-components";

import addPhotoIcon from "@/assets/images/add.svg";
import imgC from "@/assets/images/frog-face-1.svg";
// import EmotionSelector from "./components/EmotionSelector";
import imgA from "@/assets/images/frog-face-5.svg";
import imgB from "@/assets/images/places/cafe.svg";

import GreenButton from "../../common/components/GreenButton";
import CompletionSelector from "./components/CompletionSelector";
import EmotionSelector from "./components/EmotionSelector";
import FocusSelector from "./components/FocusSelector";
import timetable from "./dummyImages/시간표.png";

/** 날짜 문자열 포맷 (fallback) */
function formatKoreanDate(d = new Date()) {
  const w = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${w}`;
}

// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Write({ date: dateProp }) {
  const date = dateProp ?? formatKoreanDate(); // 외부 date 우선, 없으면 오늘 날짜

  const goals = [
    { id: 1, name: "LG 전자제품 IMC 기획서 작성", color: "var(--green-200)" },
    { id: 2, name: "총균쇠 독후감 작성하기", color: "var(--green-300)" },
    { id: 3, name: "브랜딩 광고 영상 ppt 만들기", color: "var(--green-400)" },
  ];

  const photoUrl = null; // URL or null

  const [memo, setMemo] = React.useState("");
  const [emotion, setEmotion] = React.useState(null); // { id, label } 형태로 받을 예정
  const [focus, setFocus] = React.useState(null); // { id, label }
  const [completion, setCompletion] = React.useState(3); // 1~5 점

  return (
    <Page>
      {/* 날짜 바 */}
      <DateBar >
        <DateText className="typo-h3">{date}</DateText>
      </DateBar>
      {/* 차트 + 범례 */}
      <ChartBox>
        <CircleChart />
      </ChartBox>
      <Legend>
        {goals.map((g) => (
          <LegendItem key={g.id}>
            <LegendLeft>
              <ColorDot style={{ background: g.color }} />
              <span className="typo-h4">{g.name}</span>
            </LegendLeft>
            {/* <LegendRight className="typo-label-l">{g.note ?? "—"}</LegendRight> */}
          </LegendItem>
        ))}
      </Legend>

      <Section>
        <Label className="typo-h4">오늘의 여정을 시작하기 전</Label>
        <Row>
          <InfoCard
            title="감정"
            imgSrc={imgA}
            label="좋음"
          />
          <InfoCard
            title="잔여 에너지"
            imgSrc={imgC}
            label="기운 없음"
          />
          <InfoCard
            title="장소"
            imgSrc={imgB}
            label="카페"
          />
        </Row>
      </Section>

      {/* 감정 */}
      <Section>
        <Label className="typo-h4">오늘 하루 여정을 끝낸 기분이 어때요?</Label>
        <EmotionSelector
          value={emotion?.id ?? null}
          onChange={(item) => setEmotion(item)}  // item = { id, label }
        />
      </Section>

      {/* 집중도 */}
      <Section>
        <Label className="typo-h4">오늘 집중도는 어땠나요?</Label>
        <FocusSelector
          value={focus?.id ?? null}
          onChange={(item) => setFocus(item)}   // { id, label }
        />
      </Section>

      {/* 완성도 */}
      <Section>
        <Label className="typo-h4">결과물의 완성도를 기록해주세요</Label>
        <CompletionRow>
          <CompletionSelector className="typo-label-s"
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
        <MemoFieldWrap>
          <MemoInput
            maxLength={1000}
            placeholder="메모"
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
          />
          <InlineCounter className="typo-body-xs">
            {memo.length}/1000
          </InlineCounter>
        </MemoFieldWrap>
      </Section>

      {/* 사진 */}
      <Section>
        <Label className="typo-h4">사진</Label>
        <PhotoBox>
          {photoUrl ? (
            <img src={photoUrl} alt="기록 사진" />
          ) : (
            <Placeholder>
              <img src={addPhotoIcon} alt="추가" />
            </Placeholder>
          )}
        </PhotoBox>

        <GreenButton style={{ margin: " 0 30%" }}>작성 완료</GreenButton>
      </Section>
    </Page>
  );
}

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 16px 24px;
  background: var(--bg-1);
  color: var(--text-1);
  box-sizing: border-box;
  overflow-x: hidden;
`;

const DateBar = styled.h3`
  position: sticky;
  top: 0;
  background: var(--bg-1);
  padding: 10px 0 12px;
  text-align: center;
  color: var(--text-1, #000);
`;
const DateText = styled.div`
  margin: 0;
  color: var(--text-1);
`;

const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const CircleChart = styled.img.attrs({ src: timetable, alt: "시간표" })`
  object-fit: cover;
  width: 75%;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 2px 0;
`;
const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  min-width: 0; /* ellipsis를 위해 필요 */
  > span {
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 64vw; /* 이름이 길 때 줄바꿈 대신 말줄임 */
  }
`;

// const LegendRight = styled.span`
//   color: var(--text-2);
//   white-space: nowrap;
// `;

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  color: var(--text-1);
  margin: 10px 0;
`;

const Selected = styled.div`
  padding: 8px 2px;
  border-radius: 8px;
  border: 1px solid var(--natural-400);
  font-size: var(--fs-md);
`;

const CompletionRow = styled.div`
  display: flex;
  flex-direction: column;   /* 세로로 쌓기 */
  width: 100%;              /* 부모 가로 전체 */
  align-items: stretch;     /* 내부 요소도 가로 꽉 차도록 */
  gap: 8px;
`;

const MemoFieldWrap = styled.div`
  position: relative;
  padding: 6px 0 10px;                /* 아래 여백으로 밑줄과 간격 */
  border-bottom: 1px solid var(--natural-400);
  transition: border-color 150ms ease;
  &:focus-within {
    border-bottom-color: var(--primary-1);  /* 포커스 시 강조 */
  }
`;

const MemoInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-family: var(--ff-sans);
  font-size: var(--fs-sm);
  line-height: 1.4;
  resize: none;                         /* 필요시 vertical로 변경 */
  box-sizing: border-box;
  padding-right: 56px;                  /* 우측 카운터 자리 */
  /* iOS 확대 방지 */
  -webkit-text-size-adjust: 100%;

  ::placeholder {
    color: var(--text-3);
  }
`;

const InlineCounter = styled.div`
  position: absolute;
  right: 0;
  bottom: 10px;                         /* 밑줄 윗부분에 맞춤 */
  color: var(--text-3);
`;

const PhotoBox = styled.div`
  width: 100%;
  height: 150px;
  background:var(--natural-400);
  border: 1px solid var(--natural-400);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 50px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
`;

/* ===== 재사용 가능한 카드 ===== */
function InfoCard({ title, imgSrc, label }) {
  return (
    <Card>
      <Title className="typo-body-s">{title}</Title>
      <ImageWrapper>
        <img src={imgSrc} alt={label} />
      </ImageWrapper>
      <Label className="typo-body-xs">{label}</Label>
    </Card>
  );
}

/* ===== styled-components ===== */
const Row = styled.div`
  display: flex;
  justify-content: space-around; /* 균등 분배 */
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
`;

const Title = styled.div`
  color: var(--text-1);
`;

const ImageWrapper = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
