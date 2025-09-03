import React from "react";
import styled from "styled-components";
import FrogBar from "./FrogBar";
import { pickRandomFrog } from "../store/frogs";
import sirenIcon from "@/assets/images/siren.svg";
import SimpleModal from "../modals/SimpleModal";

export default function GoalCard({
  id: goalId,
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

  // D-Day 파서
  const { sign, num } = React.useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+)/i.exec(String(dday));
    if (!m) return { sign: 0, num: null };
    const s = m[1] === "+" ? 1 : m[1] === "-" ? -1 : 0;
    const n = parseInt(m[2], 10);
    return { sign: s, num: Number.isNaN(n) ? null : n };
  }, [dday]);
  const isUrgent = sign <= 0 && (num === 0 || num === 1);

  // 모달 상태
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  // ESC + body 스크롤 잠금
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <Container
        type="button"
        className={className}
        aria-label="Task card"
        onClick={openModal}
        data-goal-id={goalId}   // <- 추적/디버깅/테스트에 유용
      >
        <HeaderRow>
          <DDayIcon>{dday}</DDayIcon>
          <TitleWrap>
            <TaskTitle>{title}</TaskTitle>
            {isUrgent && (
              <SirenIcon src={sirenIcon} alt="긴급" title="마감 임박" />
            )}
          </TitleWrap>
        </HeaderRow>

        <CheerMsg>{warmMessage || "파이팅! 오늘도 한 걸음."}</CheerMsg>

        <ImgContainer>
          <FrogBar progress={progress} />
          <Illust aria-hidden="true">
            <img src={frogRef.current} alt="" />
          </Illust>
        </ImgContainer>
      </Container>

      <SimpleModal open={open} onClose={closeModal} title={title}>
        <Row><Label>ID</Label><Value>{goalId}</Value></Row>
        <Row>
          <Label>디데이</Label>
          <Value>{dday}</Value>
        </Row>
        <Row>
          <Label>진행률</Label>
          <Value>{Number.isFinite(+progress) ? `${+progress}%` : "0%"}</Value>
        </Row>
        {warmMessage ? <Warm>{warmMessage}</Warm> : null}
        <Actions>
          <ModalBtn type="button" onClick={closeModal}>
            닫기
          </ModalBtn>
        </Actions>
      </SimpleModal>
    </>
  );
}

/* ---------------- Styles ---------------- */

const Container = styled.button`
  /* 버튼 리셋 + 접근성 유지 */
  appearance: none;
  border: 0;
  background: var(--bg-1);
  color: inherit;
  text-align: left;

  width: 80%;
  aspect-ratio: 327 / 368;
  height: auto;

  margin: clamp(8px, 4vh, 48px) auto 0;
  padding: clamp(12px, 4.3vw, 40px) clamp(12px, 3vw, 40px);

  flex-shrink: 0;
  border-radius: clamp(12px, 4vw, 16px);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
     0.27px  0.27px 4.495px 0 var(--natural-400);

  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.8vw, 16px);
  text-align: center;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--brand-1, #18A904);
    outline-offset: 2px;
    border-radius: clamp(12px, 4vw, 16px);
  }
  &:active { transform: scale(0.996); }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: center;
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
  min-width: 0;
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
  flex: 1 1 auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
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

// 모달용 추가 
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Label = styled.span`
  color: var(--text-2, #6F737B);
  font-size: 13px;
`;
const Value = styled.span`
  color: var(--text-1, #000);
  font-weight: 700;
`;
const Warm = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-1, #111);
`;
const Actions = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
`;
const ModalBtn = styled.button`
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  background: var(--brand-1, #18A904);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;
