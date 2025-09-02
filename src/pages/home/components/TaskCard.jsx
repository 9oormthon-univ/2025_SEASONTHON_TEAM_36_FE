import React from "react";
import styled from "styled-components";
import FrogBar from "./FrogBar";
import { pickRandomCheer } from "../store/cheers.mock";
import { pickRandomFrog } from "../store/frogs";
import sirenIcon from '@/assets/images/siren.svg';

export default function TaskCard({
  dday = "D - 0",
  title = "오늘의 할 일",
  progress, // 0~100
  className,
}) {
  // 인스턴스당 1회 랜덤(리렌더에도 유지)
  // cheer
  const cheerRef = React.useRef(null);
  if (cheerRef.current == null) {
    cheerRef.current = pickRandomCheer();
  }
  // frog
  const frogRef = React.useRef(null);
  if (frogRef.current == null) {
    frogRef.current = pickRandomFrog();
  }

  // dday 숫자 파싱 (예: "D - 1" -> 1)
  const ddayNum = React.useMemo(() => {
    const m = String(dday).match(/-?\d+/g);
    if (!m || m.length === 0) return null;
    const n = parseInt(m[m.length - 1], 10);
    return Number.isNaN(n) ? null : Math.abs(n);
  }, [dday]);
  const isUrgent = ddayNum === 0 || ddayNum === 1;

  return (
    <Container role="article" aria-label="Task card" className={className}>
      <HeaderRow>
        <DDayIcon>{dday}</DDayIcon>
        <TitleWrap>
          <TaskTitle>{title}</TaskTitle>
          {isUrgent && (
            <SirenIcon
              src={sirenIcon}
              alt="긴급"
              title="마감 임박"
              aria-hidden={false}
            />
          )}
        </TitleWrap>
      </HeaderRow>

      <CheerMsg>{cheerRef.current}</CheerMsg>

      {/* 진행률을 CSS 변수 --p 로 전달 (점선/화살표와 동기화) */}
      <ImgContainer>
        <FrogBar progress={progress} />
        <Illust aria-hidden="true">
          <img src={frogRef.current} alt="" />
        </Illust>
      </ImgContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  aspect-ratio: 327 / 368;
  height: auto;

  margin: clamp(8px, 4vh, 48px) auto 0;
  padding: clamp(12px, 4.3vw, 40px) clamp(12px, 3vw, 40px);

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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  /* DDayIcon이 margin-right: 8px을 갖고 있으니 gap은 0 */
  gap: 0;
  justify-content: center;   /* 중앙 정렬 */
  width: 100%;
  flex-wrap: wrap;
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

const TitleWrap = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0; /* 긴 제목 줄바꿈 안전 */
`;

const TaskTitle = styled.h3`
  display: inline-block;
  font-size: clamp(12px, 2.9vw, 30px);
  font-weight: 700;
  color: var(--text-1);
`;

const SirenIcon = styled.img`
  width: clamp(14px, 4vw, 20px);
  height: auto;
  margin-left: 6px;
  vertical-align: middle;
  display: inline-block;
`;

const CheerMsg = styled.p`
  font-size: clamp(10px, 2.7vw, 24px);
  font-weight: 500;
  color: var(--text-2, #6F737B);
`;

const ImgContainer = styled.div`
  position: relative;
  flex: 1 1 auto; display: flex; align-items: flex-end; justify-content: flex-end;
  border-radius: 12px;
  overflow: hidden;
`;

const Illust = styled.figure`
  position: absolute;
  bottom: 3%;
  width: 80%;
  height: auto;
  pointer-events: none;
  img { width: 100%; height: 100%; display: block; object-fit: contain; }
`;
