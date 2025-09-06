// src/pages/weekly/Weekly.jsx
import React from "react";
import styled from "styled-components";

import progressImg from "./store/Daily.png";

import statImg1 from "./store/A.png";
import statImg2 from "./store/B.png";
import statImg3 from "./store/C.png";

/**
 * Weekly
 * - 상단: 달성률 카드 이미지
 * - 중단: '주간 업무 현황/집중시간/장소별 빈도' (종합 이미지에서 섹션별 crop)
 * - 하단: 요약 카드 3장(한 줄 row, 작으면 가로 스크롤)
 */
export default function Weekly() {
  return (
    <Wrap>
      {/* 요약 카드 3장 한 줄 */}
      <StatsRow
        height={128}
        items={[
          { src: statImg1, alt: "한달동안 90시간 집중했어요" },
          { src: statImg2, alt: "한달 평균 달성률 87%" },
          { src: statImg3, alt: "장소: 카페에서 가장 많이 집중" },
        ]}
      />

      <Card aria-label="">
        <ImgBox>
          <ImgFull src={progressImg} alt="" />
        </ImgBox>
      </Card>
    </Wrap>
  );
}


const Wrap = styled.div`
  display: grid;
  gap: 14px;
  padding: 4px;
  background: var(--bg-1, #fff);
`;

const Card = styled.section`
  padding: 20px 20px 20px 30px;
  border-radius: 40px;
  background: var(--natural-0, #fff);
  box-shadow: -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
              0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
`;

/* 원본 이미지를 전체로 보여줄 때 */
const ImgBox = styled.div`
  overflow: hidden;
`;
const ImgFull = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

// ① Row가 화면의 90% 폭 차지, 가운데 정렬, 고정 높이
function StatsRow({ items = [], height = 128, className, ariaLabel = "요약 카드" }) {
  return (
    <Row
      role="list"
      className={className}
      aria-label={ariaLabel}
      style={{ "--rowH": typeof height === "number" ? `${height}px` : height }}
    >
      {items.map((it, i) => (
        <ImgWrap role="listitem" key={i}>
          <Img
            src={it.src}
            alt={it.alt ?? ""}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </ImgWrap>
      ))}
    </Row>
  );
}

const Row = styled.div`
  width: 100%;
  margin: 0 auto;         ]
  height: var(--rowH, 128px);  
  display: flex;
  gap: 12px;

  /* 스크롤 필요 없게 한 줄에 3등분 */
  overflow: hidden;
`;

// ③ 3등분: 각 아이템이 Row 높이를 그대로 상속받아 채움
const ImgWrap = styled.div`
  flex: 1 1 0;      /* 3등분 */
  min-width: 0;     /* 내용이 커도 flex 아이템이 늘어나지 않도록 */
  height: 100%;     /* Row 높이를 그대로 사용 */
  display: grid;
  place-items: center;
`;

// ④ 이미지가 래퍼 크기 안에서 '가득' 채우되 넘치지 않게
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;  /* 비율 유지, 넘치지 않음 */
  display: block;
`;
