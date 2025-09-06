// src/pages/weekly/Weekly.jsx
import React from "react";
import styled from "styled-components";

// ⬇️ 프로젝트에 맞게 경로 수정하세요.
// 예: /src/assets/images/weekly/charts.png, /src/assets/images/weekly/progress.png
import chartsImg from "./store/달성률.png";       // (1) 종합 차트 이미지
import progressImg from "./store/Weekly2.png";   // (2) 달성률 카드 이미지

/**
 * Weekly
 * props:
 *  - chartsSrc: string   // (필수) 1번 종합 차트 이미지 (파이/세로막대/가로막대가 한 장에 들어있는 이미지)
 *  - progressSrc: string // (필수) 2번 달성률 카드 이미지
 *
 * 사용 예시:
 * <Weekly chartsSrc={chartsImg} progressSrc={progressImg} />
 */
export default function Weekly() {
  return (
    <Wrap>
      <ImgBox>
        <ImgFull src={chartsImg} alt="달성률 카드" />
      </ImgBox>

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
`;

const Card = styled.section`
padding: 20px;
padding-left: 30px;
border-radius: 40px;
background: var(--natural-0, #FFF);
box-shadow: -0.3px -0.3px 5px 0 var(--natural-400, #D6D9E0), 0.3px 0.3px 5px 0 var(--natural-400, #D6D9E0);
`;

/* 원본 이미지를 전체로 보여줄 때 */
const ImgBox = styled.div`
  border-radius: 14px;
  overflow: hidden;
`;
const ImgFull = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

/**
 * CropImg
 * - 한 장짜리 종합 차트(chartsSrc)를 섹션별로 나눠 보이게 하기 위한 컴포넌트
 * - object-fit: cover + object-position 으로 상/중/하 영역만 노출
 * - 이미지 원본(1번)의 세로 비율에 따라 필요하면 높이/position 값을 미세 조정하세요.
 */
const CropImg = styled.img`
  width: 100%;
  display: block;
  object-fit: cover;

  /* 모바일 기준 높이 기본값들 (필요시 조정) */
  height: ${({ $crop }) =>
    $crop === "pie" ? "210px" :
      $crop === "vbar" ? "230px" :
        $crop === "hbar" ? "200px" : "220px"};

  /* 상단/가운데/하단 근사 포지셔닝 */
  object-position: ${({ $crop }) =>
    $crop === "pie" ? "center top" :
      $crop === "vbar" ? "center center" :
        $crop === "hbar" ? "center bottom" : "center"};

  /* 큰 화면일 때 높이 살짝 키우기 */
  @media (min-width: 480px) {
    height: ${({ $crop }) =>
    $crop === "pie" ? "260px" :
      $crop === "vbar" ? "280px" :
        $crop === "hbar" ? "240px" : "260px"};
  }
`;
