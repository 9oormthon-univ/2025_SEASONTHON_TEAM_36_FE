import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import OnbGoalHeader from "../components/OnbGoalHeader";

export default function StepPlayingModal() {
  // ===== 타이머 상태 =====
  const [isRunning, setIsRunning] = useState(true); // 재생/일시정지
  const [baseElapsedMs, setBaseElapsedMs] = useState(0); // 누적 시간(ms), 일시정지 시 확정
  const resumeStartRef = useRef<number | null>(Date.now()); // 재개 기준 시각(ms)
  const intervalRef = useRef<number | null>(null);
  const [nowTs, setNowTs] = useState(Date.now());

  // 휴식 횟수: 일시정지 버튼 누를 때 +1
  const [breakCount, setBreakCount] = useState(0);

  // 진행 중 경과 시간(ms) = base + (지금 - 재개시각)
  const liveElapsedMs = useMemo(() => {
    if (!isRunning || resumeStartRef.current == null) return baseElapsedMs;
    return baseElapsedMs + (nowTs - resumeStartRef.current); // ✅ nowTs 포함
  }, [isRunning, baseElapsedMs, nowTs]); // ✅ nowTs 의존성 추가

  // 1초마다 강제 리렌더(숫자 갱신)
  useEffect(() => {
    // 인터벌 클리어 유틸
    const clear = () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (isRunning) {
      // 재개 시각이 없으면 지금 시각으로
      if (resumeStartRef.current == null) {
        resumeStartRef.current = Date.now();
      }
      // 1초 간격 리렌더
      intervalRef.current = window.setInterval(() => {
        // 상태는 liveElapsedMs 계산에 의존하므로 setState 불필요
        // 단, React가 리렌더 하도록 no-op set을 사용하거나 base를 유지
        // 여기선 강제 리렌더를 위해 baseElapsedMs를 그대로 set (값 동일, 변경 없음)
        setBaseElapsedMs(prev => prev);
      }, 1000);
    } else {
      clear();
    }

    return () => clear();
  }, [isRunning]);

  useEffect(() => {
    const clear = () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (isRunning) {
      if (resumeStartRef.current == null) {
        resumeStartRef.current = Date.now();
      }
      intervalRef.current = window.setInterval(() => {
        setNowTs(Date.now()); // ✅ 매초 실제 시간 갱신 -> 리렌더 트리거
      }, 1000);
    } else {
      clear();
    }

    return () => clear();
  }, [isRunning]);

  // 언마운트 시 확실히 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 경과시간 포맷터(hh:mm:ss)
  const timerText = useMemo(() => {
    const total = Math.max(0, Math.floor(liveElapsedMs / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  }, [liveElapsedMs]);

  const colortoken = "var(--green-200)";

  return (
    <div style={{ background: "var(--bg-2)" }}>
      <Body>
        <HeaderWrapper>
          <OnbGoalHeader />
          <Title className="typo-h3">글 검토하고 맞춤법 검사하기</Title>
        </HeaderWrapper>

        <Content role="region" aria-label="step 진행 중">
          <GaugeArea>
            <Ring colortoken={colortoken}>
              {ringSVG}
              <RingCenter>
                <SmallPill className="typo-body-xs">{`휴식 ${breakCount}회`}</SmallPill>
                <Timer aria-label="경과 시간" className="typo-h2">
                  {timerText}
                </Timer>
              </RingCenter>
            </Ring>
          </GaugeArea>
        </Content>

        <BottomActions>
          <CircleButton aria-label={isRunning ? "일시정지" : "재개"} onClick={() => {}}>
            {isRunning ? pauseIcon : playIcon}
          </CircleButton>
          <ConfirmButton aria-label="완료" onClick={() => {}}>
            {confirmIcon}
          </ConfirmButton>
        </BottomActions>
      </Body>
    </div>
  );
}

/* ================= styles ================= */

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding-bottom: 20px;
  background: var(--bg-2);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin: 14vw 0 0 6px;
`;

const Title = styled.h2`
  color: var(--text-1, #000);
  text-align: center;
  word-break: keep-all;
`;

const Content = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
`;

const GaugeArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40vh;
`;

const Ring = styled.div<{ colortoken: string }>`
  position: relative;
  height: 28vh;
  width: 28vh;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;

  svg {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    color: ${({ colortoken }) => colortoken};
    transition: color 0.4s ease;
  }
`;

const RingCenter = styled.div`
  grid-area: 1 / 1;
  position: relative;
  display: grid;
  place-items: center;
  gap: 24px;
  grid-template-rows: auto auto;
`;

const SmallPill = styled.div`
  border: 1px solid var(--primary-1);
  background: var(--icon-3, #fff);
  padding: 8px 24px;
  border-radius: 28px;
  line-height: 1;
`;

const Timer = styled.div`
  margin: 0;
  color: #000;
  text-align: center;
`;

const BottomActions = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10vw;
  bottom: 10vh;
  margin-top: 50px;
`;

const CircleButton = styled.button`
  height: 9vh;
  aspect-ratio: 1 / 1;
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

/* ====== icons ====== */

const pauseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 25 30" fill="none">
    <path d="M0 29.0389H8.29684V0H0V29.0389ZM16.5937 0V29.0389H24.8905V0H16.5937Z" fill="black" />
  </svg>
);

const playIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none">
    <path d="M0 0L26 15L0 30V0Z" fill="black" />
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
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58.371 293.526C56.2486 295.796 52.6807 295.922 50.4815 293.726C27.4187 270.703 11.3417 241.569 4.1823 209.699C-3.38874 175.996 -0.636577 140.794 12.0804 108.678C24.7974 76.5612 46.89 49.0177 75.4813 29.6338C104.073 10.25 137.838 -0.075992 172.381 0.000444C206.923 0.0768772 240.643 10.5522 269.148 30.0624C297.653 49.5725 319.624 77.2135 332.198 109.386C344.773 141.559 347.369 176.772 339.649 210.441C332.349 242.28 316.143 271.342 292.979 294.263C290.77 296.448 287.203 296.307 285.09 294.028C282.978 291.748 283.121 288.195 285.325 286.004C306.834 264.624 321.886 237.562 328.681 207.926C335.896 176.46 333.469 143.55 321.717 113.483C309.965 83.415 289.432 57.5824 262.792 39.3487C236.152 21.115 204.638 11.325 172.356 11.2536C140.073 11.1822 108.517 20.8326 81.7961 38.9482C55.0753 57.0639 34.4282 82.8053 22.5432 112.821C10.6583 142.836 8.08615 175.735 15.1618 207.232C21.8259 236.898 36.7571 264.026 58.1717 285.502C60.3659 287.702 60.4933 291.256 58.371 293.526Z"
      fill="currentColor"
    />
  </svg>
);
