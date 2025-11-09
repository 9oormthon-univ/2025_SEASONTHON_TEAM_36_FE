import type { OnbStage } from "../engine/stages";

/** ===== 하이라이트 스팟 타입 ===== */
export type HighlightSpot = {
  rect: DOMRect; // window 기준 좌표(getBoundingClientRect)
  radius?: number; // 둥근 모서리/원 강조용
  dotted?: boolean; // 점선 링 표시 여부
  bubbleText?: string; // 말풍선 텍스트
};

export type SceneProps = {
  stage: OnbStage;
  /** window 좌표 기준(getBoundingClientRect) */
  setSpotRect: (r: DOMRect | null) => void;
  /** 여러 스팟을 Layout에 보고 (window 좌표 기준) */
  setOverlaySpots?: (spots: HighlightSpot[]) => void;
};

export interface OnbLayoutProps {
  sceneMap: Record<string, React.ComponentType<SceneProps>>;
  stages: OnbStage[];
  activeIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSkip?: () => void; // (남겨두되 버튼은 제거)
}
