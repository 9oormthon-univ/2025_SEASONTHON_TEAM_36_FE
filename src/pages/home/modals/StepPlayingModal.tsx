import styled from "styled-components";

import PageModal from "../../../common/components/PageModal";
import GoalHeader from "../components/GoalHeader";

interface StepPlayingModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>; // 🐸 추가
  onPause?: () => void | Promise<void>; // 🐸 추가
}

export default function StepPlayingModal({
  open,
  onClose,
  onConfirm,
  onPause,
}: StepPlayingModalProps) {
  // ---- 데모용 더미 텍스트 (기능 구현 전) ----
  const dDay = "D-1";
  const goalTitle = "총균쇠 독후감 작성";
  const stepTitle = "p130 ~ 170까지 읽기";
  const breakCountText = "휴식 3회";
  const timerText = "03 : 15 : 00";

  // 게이지 표시용 데모 진행도(정적)
  const timeElapsed = 0.78; // 0~1 사이 값, 현재는 레이아웃 확인용 고정

  return (
    <PageModal title="" open={open} onClose={onClose} hideHeader>
      <Body>
        <HeaderWrapper>
          <GoalHeader dDay={dDay} title={goalTitle} />

          <Title className="typo-h2">{stepTitle}</Title>
        </HeaderWrapper>

        <Content role="region" aria-label="step 진행 중">
          <GaugeArea>
            <Ring timeElapsed={timeElapsed}>
              {ringSVG}
              <RingCenter>
                <SmallPill className="typo-body-xs">{breakCountText}</SmallPill>
                <Timer aria-label="남은 시간" className="typo-h1">
                  {timerText}
                </Timer>
              </RingCenter>
            </Ring>
          </GaugeArea>

          <BottomActions>
            <CircleButton aria-label="일시정지" onClick={() => void onPause?.()}>
              {pauseIcon}
            </CircleButton>
            <ConfirmButton aria-label="완료" onClick={() => void onConfirm?.()}>
              {confirmIcon}
            </ConfirmButton>
          </BottomActions>
        </Content>
      </Body>
    </PageModal>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin: 24vw 0 0 6px;
`;

const Title = styled.h2`
  color: var(--text-1, #000);
  text-align: center;
`;

const Content = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: flex-start; /* 상단 과도한 여백 방지 */
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
`;

const GaugeArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48vh; /* 링이 화면 중앙 근처에 자리 잡도록 */
`;

const Ring = styled.div<{ timeElapsed: number }>`
  position: relative;
  width: 80vw; /* 모바일에서 조금 더 크게 */
  aspect-ratio: 1 / 1;
  display: grid; /* svg와 center를 같은 셀에 겹침 */
  place-items: center;

  svg {
    grid-area: 1 / 1; /* 겹치기 */
    width: 100%;
    height: 100%;
    transition: fill 0.4s ease;
    fill: ${({ timeElapsed }) => {
      if (timeElapsed < 0.33) return "#C2F2C2"; // 연한 초록
      if (timeElapsed < 0.66) return "#86EC78"; // 중간 초록
      return "#0F6C0F"; // 진한 초록
    }};
  }
`;

const RingCenter = styled.div`
  grid-area: 1 / 1; /* svg 위에 정확히 겹치기 */
  position: relative;
  display: grid;
  place-items: center;
  gap: 24px;
  grid-template-rows: auto auto;
`;

const SmallPill = styled.div`
  border: 1px solid var(--primary-1);
  background: var(--icon-3, #fff);
  padding: 10px 28px; /* 살짝 컴팩트하게 */
  border-radius: 28px;
  line-height: 1;
`;

const Timer = styled.div`
  margin: 0; /* 중앙에서 아래로 밀리는 현상 방지 */
  color: #000;
  text-align: center;
`;

const BottomActions = styled.div`
  position: absolute;
  bottom: 16vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20vw;
`;

const CircleButton = styled.button`
  width: 83px;
  height: 83px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid #e6e8ec;
  display: grid;
  place-items: center;
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
`;

const ConfirmButton = styled(CircleButton)`
  background: var(--green-100);
  border: none;
`;

const pauseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 25 30" fill="none">
    <path d="M0 29.0389H8.29684V0H0V29.0389ZM16.5937 0V29.0389H24.8905V0H16.5937Z" fill="black" />
  </svg>
);

const confirmIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="25" viewBox="0 0 33 25" fill="none">
    <path
      d="M10.9573 24.0766L0.612157 13.7315C-0.204051 12.9153 -0.204052 11.592 0.612156 10.7758C1.42836 9.95957 2.7517 9.95957 3.5679 10.7758L10.9573 18.1651L28.5103 0.612153C29.3265 -0.204055 30.6498 -0.204056 31.466 0.612152C32.2822 1.42836 32.2822 2.75169 31.466 3.5679L10.9573 24.0766Z"
      fill="black"
    />
  </svg>
);

const ringSVG = (
  <svg
    width="344"
    height="296"
    viewBox="0 0 344 296"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58.371 293.526C56.2486 295.796 52.6807 295.922 50.4815 293.726C27.4187 270.703 11.3417 241.569 4.1823 209.699C-3.38874 175.996 -0.636577 140.794 12.0804 108.678C24.7974 76.5612 46.89 49.0177 75.4813 29.6338C104.073 10.25 137.838 -0.075992 172.381 0.000444C206.923 0.0768772 240.643 10.5522 269.148 30.0624C297.653 49.5725 319.624 77.2135 332.198 109.386C344.773 141.559 347.369 176.772 339.649 210.441C332.349 242.28 316.143 271.342 292.979 294.263C290.77 296.448 287.203 296.307 285.09 294.028C282.978 291.748 283.121 288.195 285.325 286.004C306.834 264.624 321.886 237.562 328.681 207.926C335.896 176.46 333.469 143.55 321.717 113.483C309.965 83.415 289.432 57.5824 262.792 39.3487C236.152 21.115 204.638 11.325 172.356 11.2536C140.073 11.1822 108.517 20.8326 81.7961 38.9482C55.0753 57.0639 34.4282 82.8053 22.5432 112.821C10.6583 142.836 8.08615 175.735 15.1618 207.232C21.8259 236.898 36.7571 264.026 58.1717 285.502C60.3659 287.702 60.4933 291.256 58.371 293.526Z"
      fill="#0E7400"
    />
  </svg>
);
