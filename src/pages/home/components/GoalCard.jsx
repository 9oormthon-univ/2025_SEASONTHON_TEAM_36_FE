import React from "react";
import styled from "styled-components";
import FrogBar from "./FrogBar";
import { pickRandomFrog } from "../store/frogs";
import sirenIcon from "@/assets/images/siren.svg";
import AdjustGoalModal from "../modals/AdjustGoalModal";
import GoalStepsModal from "../modals/GoalStepsModal";
import { DDayIcon } from "../styles/DDayIcon";

export default function GoalCard({
  id: goalId,
  dday = "D-0",
  title = "오늘의 할 일",
  progress = 0,
  warmMessage,
  shrink = 1,   // ✅ shrink prop
  className,
}) {
  const frogRef = React.useRef(null);
  if (frogRef.current == null) {
    frogRef.current = pickRandomFrog();
  }

  const { sign, num } = React.useMemo(() => {
    const m = /D\s*([+-])?\s*(\d+)/i.exec(String(dday));
    if (!m) return { sign: 0, num: null };
    const s = m[1] === "+" ? 1 : m[1] === "-" ? -1 : 0;
    const n = parseInt(m[2], 10);
    return { sign: s, num: Number.isNaN(n) ? null : n };
  }, [dday]);
  const isUrgent = sign <= 0 && (num === 0 || num === 1);

  const [openSteps, setOpenSteps] = React.useState(false);
  const [openAdjust, setOpenAdjust] = React.useState(false);
  const anyOpen = openSteps || openAdjust;

  const openStepsModal = () => setOpenSteps(true);
  const closeStepsModal = () => setOpenSteps(false);
  const openAdjustModal = () => setOpenAdjust(true);
  const closeAdjustModal = () => setOpenAdjust(false);

  React.useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e) =>
      e.key === "Escape" &&
      (openAdjust ? closeAdjustModal() : closeStepsModal());
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [anyOpen, openAdjust]);

  const onCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openStepsModal();
    }
  };

  return (
    <>
      <Container
        role="button"
        tabIndex={0}
        className={className}
        aria-label="Task card"
        onClick={openStepsModal}
        onKeyDown={onCardKeyDown}
        data-goal-id={goalId}
        $shrink={shrink}   // ✅ styled-components에 전달
      >
        <HeaderRow>
          <DDayIcon>{dday}</DDayIcon>
          <TitleWrap>
            <TaskTitle>{title}</TaskTitle>
            {isUrgent && (
              <SirenButton
                type="button"
                title="마감 임박: 목표 조정"
                aria-label="마감 임박: 목표 조정"
                onClick={(e) => {
                  e.stopPropagation();
                  openAdjustModal();
                }}
              >
                <SirenIcon src={sirenIcon} alt="" aria-hidden="true" />
              </SirenButton>
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

      <GoalStepsModal
        open={openSteps}
        onClose={closeStepsModal}
        goal={{ id: goalId, dday, title, progress: +progress || 0, warmMessage }}
      />

      <AdjustGoalModal
        open={openAdjust}
        onClose={closeAdjustModal}
        goal={{ id: goalId, dday, title, progress: +progress || 0, warmMessage }}
      />
    </>
  );
}

const Container = styled.div`
  background: var(--bg-1);
  color: inherit;

  /* shrink 반영 */
  width: ${(p) => 80 * p.$shrink}%;
  aspect-ratio: 327 / 368;
  max-height: calc(100% - 24px);

  margin: clamp(8px, 2.5vh, 48px) auto 0;
  padding: clamp(12px, 4.3vw, 40px) clamp(12px, 3vw, 40px);

  border-radius: clamp(12px, 4vw, 16px);
  box-shadow:
    -0.27px -0.27px 4.495px 0 var(--natural-400),
     0.27px  0.27px 4.495px 0 var(--natural-400);

  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.8vw, 16px);
  text-align: center;
  cursor: pointer;

  transition: width 0.25s ease;

  &:focus-visible {
    outline: 2px solid var(--brand-1, #18A904);
    outline-offset: 2px;
    border-radius: clamp(12px, 4vw, 16px);
  }
  &:active {
    transform: scale(0.996);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
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

/** 🚨 사이렌: 진짜 버튼 */
const SirenButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  margin-left: 6px;
  padding: 6px;            /* 터치 영역 확보 */
  border-radius: 9999px;
  line-height: 0;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--brand-1, #18A904);
    outline-offset: 2px;
  }
  &:active { transform: scale(0.96); }
`;

const SirenIcon = styled.img`
  width: clamp(14px, 4vw, 20px);
  height: auto;
  display: block;
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
