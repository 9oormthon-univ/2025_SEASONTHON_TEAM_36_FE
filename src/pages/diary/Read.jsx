// 일기 작성 페이지
import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import picture from "@/assets/images/default.png";
// import EmotionSelector from "./components/EmotionSelector";
import angry from "@/assets/images/emotions/angry.svg";
import blue from "@/assets/images/emotions/blue.svg";
import disappointed from "@/assets/images/emotions/disappointed.svg";
import excited from "@/assets/images/emotions/excited.svg";
import frustrated from "@/assets/images/emotions/frustrated.svg";
import hollow from "@/assets/images/emotions/hollow.svg";
import joy from "@/assets/images/emotions/joy.svg";
import love from "@/assets/images/emotions/love.svg";
import peace from "@/assets/images/emotions/peace.svg";
import soso from "@/assets/images/emotions/soso.svg";
import face1 from "@/assets/images/frog-face-1.svg";
import face2 from "@/assets/images/frog-face-2.svg";
import face3 from "@/assets/images/frog-face-3.svg";
import face4 from "@/assets/images/frog-face-4.svg";
import face5 from "@/assets/images/frog-face-5.svg";
import perfection20 from "@/assets/images/perfection/perfection20.svg";
import perfection40 from "@/assets/images/perfection/perfection40.svg";
import perfection60 from "@/assets/images/perfection/perfection60.svg";
import perfection80 from "@/assets/images/perfection/perfection80.svg";
import perfection100 from "@/assets/images/perfection/perfection100.svg";
import cafe from "@/assets/images/places/cafe.svg";
import guitar from "@/assets/images/places/guitar.svg";
import home from "@/assets/images/places/home.svg";
import job from "@/assets/images/places/job.svg";
import lecture from "@/assets/images/places/lecture.svg";
import library from "@/assets/images/places/library.svg";

import timetable from "./dummyImages/시간표.png";

/** 날짜 문자열 포맷 (fallback) */
function formatKoreanDate(d = new Date()) {
  const w = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${w}`;
}

const prevEmotion = {
  0: {
    img: face1,
    text: "매우 좋지 않음",
  },
  1: {
    img: face2,
    text: "좋지 않음",
  },
  2: {
    img: face3,
    text: "보통",
  },
  3: {
    img: face4,
    text: "좋음",
  },
  4: {
    img: face5,
    text: "매우 좋음",
  },
};

const energy = {
  0: {
    img: face1,
    text: "기운 없음",
  },
  1: {
    img: face2,
    text: "기운 조금",
  },
  2: {
    img: face3,
    text: "보통",
  },
  3: {
    img: face4,
    text: "에너지 조금",
  },
  4: {
    img: face5,
    text: "에너지 넘침",
  },
};

const concentration = {
  0: {
    img: face1,
    text: "산만함",
  },
  1: {
    img: face2,
    text: "살짝 집중",
  },
  2: {
    img: face3,
    text: "집중됨",
  },
  3: {
    img: face4,
    text: "몰입",
  },
  4: {
    img: face5,
    text: "초집중",
  },
};

const place = {
  0: {
    img: home,
    text: "집",
  },
  1: {
    img: job,
    text: "직장",
  },
  2: {
    img: cafe,
    text: "카페",
  },
  3: {
    img: library,
    text: "도서관",
  },
  4: {
    img: lecture,
    text: "강의실",
  },
  5: {
    img: guitar,
    text: "기타",
  },
};

const emotion = {
  0: {
    img: joy,
    text: "즐거웠어",
  },
  1: {
    img: love,
    text: "설렜어",
  },
  2: {
    img: peace,
    text: "평온했어",
  },
  3: {
    img: soso,
    text: "그저그래",
  },
  4: {
    img: excited,
    text: "짜릿했어",
  },
  5: {
    img: frustrated,
    text: "답답했어",
  },
  6: {
    img: blue,
    text: "우울했어",
  },
  7: {
    img: hollow,
    text: "허무했어",
  },
  8: {
    img: angry,
    text: "화가났어",
  },
  9: {
    img: disappointed,
    text: "실망했어",
  },
};

const perfection = {
  0: perfection20,
  1: perfection40,
  2: perfection60,
  3: perfection80,
  4: perfection100,
};

// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Read({ date: dateProp }) {
  const date = dateProp ?? formatKoreanDate(); // 외부 date 우선, 없으면 오늘 날짜
  const { state } = useLocation();

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
        <DateText className="typo-h3">{date}</DateText>
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
            imgSrc={prevEmotion[state.prevEmotion].img}
            label={prevEmotion[state.prevEmotion].text}
          />
          <InfoCard
            title="잔여 에너지"
            imgSrc={energy[state.energy].img}
            label={energy[state.energy].text}
          />
          <InfoCard title="장소" imgSrc={place[state.place].img} label={place[state.place].text} />
        </Row>
      </Section>

      <Section>
        <Label className="typo-h4">오늘의 여정을 끝낸 후</Label>
        <Row>
          <InfoCard
            title="감정"
            imgSrc={emotion[state.emotion - 1].img}
            label={emotion[state.emotion - 1].text}
          />
          <InfoCard
            title="집중도"
            imgSrc={concentration[state.concentration].img}
            label={concentration[state.concentration].text}
          />
          <InfoCard
            title="완성도"
            imgSrc={perfection[Math.floor(state.perfection === 100 ? 4 : state.perfection / 20)]}
            label={`${state.perfection}%`}
          />
        </Row>
      </Section>

      {/* 메모 */}
      <Section>
        <Label className="typo-h4">MEMO</Label>
        <MemoFieldWrap>
          <MemoInput value={`${state.memo}`} placeholder="메모" readOnly rows={3} />
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
              <img src={picture} alt="추가" />
            </Placeholder>
          )}
        </PhotoBox>
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
const DateText = styled.h2`
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

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  color: var(--text-1);
  margin: 10px 0;
`;

const MemoFieldWrap = styled.div`
  position: relative;
  padding: 6px 0 10px; /* 아래 여백으로 밑줄과 간격 */
  border-bottom: 1px solid var(--natural-400);
  transition: border-color 150ms ease;
  &:focus-within {
    border-bottom-color: var(--primary-1); /* 포커스 시 강조 */
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
  resize: none; /* 필요시 vertical로 변경 */
  box-sizing: border-box;
  padding-right: 56px; /* 우측 카운터 자리 */
  /* iOS 확대 방지 */
  -webkit-text-size-adjust: 100%;

  ::placeholder {
    color: var(--text-3);
  }
`;

const PhotoBox = styled.div`
  width: 100%;
  height: 150px;
  background: var(--natural-400);
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
const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
`;
