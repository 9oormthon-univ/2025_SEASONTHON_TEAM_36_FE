import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import bigSiren from "@/assets/images/big-siren.svg";

import {
  CenterSiren,
  DimOverlay,
  DottedCircleFixed,
  DottedCircleLocal,
  Frame,
  FrameOverlay,
  FramePlaceholder,
  FrameWrap,
  HintAnim,
  HintSpacer,
  HintText,
  OverlayLayer,
  Pulse,
  Root,
  SkipBtn,
  SpotBubbleFixed,
  SpotBubbleLocal,
  SpotDimFixed,
  SpotDimLocal,
} from "./OnbLayout.styles";
import type { OnbLayoutProps } from "./OnbLayout.types";
import { shouldIgnoreTarget, toLocalRect } from "./OnbLayout.utils";

export default function OnbLayout({
  sceneMap,
  stages,
  activeIndex: extIndex,
  onPrev,
  onNext,
  onSkip,
}: OnbLayoutProps) {
  // 단일/다중 스팟 상태
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const [overlaySpots, setOverlaySpots] = useState<HighlightSpot[]>([]);

  // 프레임/포털
  const frameRef = useRef<HTMLDivElement>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  // 포털 + scroll lock
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "onb-portal";
    el.style.position = "relative";
    el.style.zIndex = String(2147483647);
    document.body.appendChild(el);
    setPortalEl(el);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeChild(el);
    };
  }, []);

  const activeIndex = useMemo(() => extIndex ?? 0, [extIndex]);
  const stage = stages[activeIndex] ?? null;
  const showBigSiren = !!stage && stage.componentKey === "big-siren";

  // stage 전환 시 스팟 초기화
  useEffect(() => setSpotRect(null), [stage?.id]);
  useEffect(() => setOverlaySpots([]), [stage?.id, stage?.componentKey]);

  // 단일 spotRect → 프레임 로컬 변환
  const localSpot = useMemo(() => {
    if (!spotRect || !frameRef.current) return null;
    return toLocalRect(spotRect, frameRef.current);
  }, [spotRect]);

  // 키보드 네비
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onSkip]);

  // 인터랙션 1회만 진행
  const didAdvanceRef = useRef(false);
  useEffect(() => {
    didAdvanceRef.current = false; // 스테이지 진입마다 리셋
  }, [stage?.id]);

  const canAdvance = true; // stage.footer?.nextEnabled 없으면 true

  const isLastAnimation = stage.id === "end";

  const advanceNextIfAllowed = useCallback(() => {
    // Prevent advancing during final stage
    if (didAdvanceRef.current || !canAdvance || isLastAnimation) return;

    didAdvanceRef.current = true;
    // Trigger onNext if not on "end" stage
    if (stage?.id !== "end") {
      onNext?.();
    }
  }, [canAdvance, onNext, isLastAnimation, stage?.id]);

  // 프레임 내부 액션 → 다음
  const advanceOnUserAction = useCallback(
    (e: React.SyntheticEvent | React.PointerEvent | React.KeyboardEvent) => {
      if (shouldIgnoreTarget(e.target)) return;
      if ("key" in e) {
        const k = e.key;
        if (k !== "Enter" && k !== " ") return;
      }
      advanceNextIfAllowed();
    },
    [advanceNextIfAllowed],
  );

  // wheel 핸들러(타입 분리)
  const onFrameWheel: React.WheelEventHandler<HTMLDivElement> = e => {
    if (shouldIgnoreTarget(e.target)) return;
    advanceNextIfAllowed();
  };

  // 루트 배경 클릭 → 좌/우 반 화면 네비
  // const handleRootClick = useCallback(
  //   (e: React.MouseEvent) => {
  //     const x = e.clientX;
  //     const mid = window.innerWidth / 2;
  //     if (x < mid) onPrev?.();
  //     else advanceNextIfAllowed();
  //   },
  //   [advanceNextIfAllowed, onPrev],
  // );
  // Automatically skip "end" stage after 5 seconds
  useEffect(() => {
    if (stage?.id === "end") {
      const timeout = setTimeout(() => {
        onSkip?.(); // Automatically skip after the timeout
      }, 3000); // 3 seconds after the "end" screen appears

      return () => clearTimeout(timeout);
    }
  }, [stage?.id, onSkip]);

  if (!stage || !portalEl) return null;
  const Scene = stage.sceneKey ? sceneMap[stage.sceneKey] : undefined;

  return createPortal(
    <Root
      $transparentBg={showBigSiren || stage.id === "end"}
      onClick={e => {
        if (stage.id !== "end") {
          advanceNextIfAllowed();
        }
      }}
    >
      {onSkip && stage.id !== "end" && (
        <SkipBtn
          type="button"
          data-onb-no-advance="true"
          aria-label="온보딩 건너뛰기"
          title="건너뛰기"
          onClick={e => {
            e.stopPropagation();
            onSkip?.();
          }}
          onPointerDown={e => e.stopPropagation()}
        >
          건너뛰기
        </SkipBtn>
      )}

      {stage.id === "end" && <DimOverlay />}

      {/* 프레임 (앱 미리보기 캔버스) */}
      {stage.id !== "end" && (
        <FrameWrap>
          <Frame
            ref={frameRef}
            aria-label="Onboarding Frame"
            onClick={e => e.stopPropagation()}
            onPointerDown={advanceOnUserAction}
            onKeyDown={advanceOnUserAction}
            onInput={advanceOnUserAction}
            onWheel={onFrameWheel}
            tabIndex={-1}
          >
            {Scene ? (
              <Scene
                key={stage.id}
                stage={stage}
                setSpotRect={setSpotRect}
                setOverlaySpots={setOverlaySpots}
              />
            ) : (
              <FramePlaceholder>sceneKey가 없습니다.</FramePlaceholder>
            )}

            {/* 프레임 내부 오버레이(로컬 스팟) */}
            <FrameOverlay>
              {localSpot && (
                <SpotDimLocal
                  $rect={localSpot}
                  $radius={stage.componentKey === "goal-card" ? 12 : 9999}
                />
              )}
              {stage.pulse && localSpot ? <Pulse $rect={localSpot} /> : null}

              {stage.componentKey === "chatbot" && localSpot ? (
                <>
                  <DottedCircleLocal $rect={localSpot} />
                  <SpotBubbleLocal $rect={localSpot}>AI 개구리 ‘Rana’</SpotBubbleLocal>
                </>
              ) : null}
            </FrameOverlay>

            {/* 빅 사이렌 모드 */}
            {showBigSiren && (
              <>
                <DimOverlay />
                <CenterSiren role="img" aria-label="긴급 경고 사이렌">
                  <img src={bigSiren} alt="" />
                </CenterSiren>
              </>
            )}
          </Frame>
        </FrameWrap>
      )}

      {(showBigSiren || stage.id === "end") && <HintSpacer />}

      {/* 하단 힌트 텍스트(앱 UI 위) */}
      <HintText
        className="typo-h4"
        $centered={showBigSiren || stage.id === "end"}
        $isSiren={showBigSiren}
        $anim={(stage.hintAnim as HintAnim) ?? "fade-up"}
        $durationMs={stage.hintDurationMs ?? 600}
        $delayMs={0}
      >
        {stage.body}
      </HintText>

      {/* 전역 다중 스팟 오버레이(윈도우 고정 좌표) */}
      <OverlayLayer aria-hidden>
        {overlaySpots.map((s, i) => (
          <React.Fragment key={i}>
            <SpotDimFixed $rect={s.rect} $radius={s.radius} />
            {s.dotted && <DottedCircleFixed $rect={s.rect} />}
            {s.bubbleText ? <SpotBubbleFixed $rect={s.rect}>{s.bubbleText}</SpotBubbleFixed> : null}
          </React.Fragment>
        ))}
      </OverlayLayer>
    </Root>,
    portalEl,
  );
}

/** 내부에서만 쓰는 타입(import 순환 방지) */
type HighlightSpot = {
  rect: DOMRect;
  radius?: number;
  dotted?: boolean;
  bubbleText?: string;
};
