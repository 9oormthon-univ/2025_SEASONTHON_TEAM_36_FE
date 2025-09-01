import React from "react";
import styled from "styled-components";
import frogDefault from "@/assets/images/frog-default.svg";
import frogGlasses from "@/assets/images/frog-glasses.svg";
import FrogBar from "./FrogBar";

export default function TaskCard({
  // 더미 텍스트, 추후 Task 관련 데이터 넘겨줘야 함 ('인디케이터 바'와 연동 필요)
  dday = "D - 5",
  title = "LG 전자제품 IMC 기획서 작성",
  cheer = "느려도 괜찮아, 계속 가면 결국 도착해.",
  progress, // 0~100
  className,
}) {
  const frogSrc = progress >= 85 ? frogGlasses : frogDefault;

  return (
    <Container role="article" aria-label="Task card" className={className}>
      <div>
        <DDayIcon>{dday}</DDayIcon>
        <TaskTitle>{title}</TaskTitle>
      </div>

      <CheerMsg>{cheer}</CheerMsg>

      {/* 진행률을 CSS 변수 --p 로 전달 (점선/화살표와 동기화) */}
      <ImgContainer>
        <FrogBar progress={progress} />
        <Illust aria-hidden="true">
          <img src={frogSrc} alt="" />
        </Illust>
      </ImgContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 75%;
  aspect-ratio: 327 / 368;
  height: auto;

  margin: clamp(8px, 6vh, 48px) auto 0;
  padding: clamp(12px, 4.5vw, 40px);

  flex-shrink: 0;
  border-radius: clamp(12px, 4vw, 16px);
  background: var(--bg-1);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
     0.27px  0.27px 4.495px 0 var(--natural-400);

  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.8vw, 16px);
  text-align: center;
`;

const DDayIcon = styled.div`
  display: inline-flex;
  align-items: center;
  height: 22.5px;
  padding: 0 8px;
  border-radius: 10px;
  background: var(--green-200, #86EC78);
  color: var(--text-1);
  font-size: clamp(8px, 1.5vw, 15px);
  font-weight: 400;
  margin-right: 8px;
`;

const TaskTitle = styled.h3`
  display: inline-block;
  font-size: clamp(12px, 2.9vw, 30px);
  font-weight: 700;
  color: var(--text-1);
`;

const CheerMsg = styled.p`
  font-size: clamp(10px, 2.7vw, 24px);
  font-weight: 500;
  color: var(--text-2, #6F737B);
`;

const ImgContainer = styled.div`
  position: relative;
  flex: 1;
  margin-top: 4px;
  border-radius: 12px;
  overflow: hidden;
`;

const Illust = styled.figure`
  position: absolute;
  right: -1px;
  bottom: 4px;
  width: 65%;
  height: auto;
  margin: 0 5% 5%;
  pointer-events: none;
  opacity: 0.95;

  img { width: 100%; height: 100%; display: block; object-fit: contain; }
`;
