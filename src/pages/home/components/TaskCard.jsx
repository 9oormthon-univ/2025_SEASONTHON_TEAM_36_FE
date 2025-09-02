import React from "react";
import styled from "styled-components";
import FrogBar from "./FrogBar";
import { pickRandomFrog } from "../store/frogs";
import sirenIcon from '@/assets/images/siren.svg';

export default function TaskCard({
  dday = "D-0",
  title = "오늘의 할 일",
  progress = 0, // 0~100
  warmMessage,           
  className,
}) {
  // frog: 인스턴스당 1회 랜덤(리렌더에도 유지)
  const frogRef = React.useRef(null);
  if (frogRef.current == null) {
    frogRef.current = pickRandomFrog();
  }

  // D-Day 파서 (D-3 / D - 3 / D+1 / D0 모두 대응)
  const { sign, num } = React.useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+)/i.exec(String(dday));
    if (!m) return { sign: 0, num: null };
    const s = m[1] === "+" ? 1 : m[1] === "-" ? -1 : 0;
    const n = parseInt(m[2], 10);
    return { sign: s, num: Number.isNaN(n) ? null : n };
  }, [dday]);
  // 마감 임박: D-1 또는 D-0만 긴급, D+1(지남)는 긴급 아이콘 X
  const isUrgent = (sign <= 0) && (num === 0 || num === 1);

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

      <CheerMsg>{warmMessage || "파이팅! 오늘도 한 걸음."}</CheerMsg>

      {/* 진행률을 CSS 변수 --p 로 전달*/}
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
