// src/pages/home/onboarding/scenes/index.ts
import { useCallback, useEffect, useState } from "react";

import { getOnbDone, setOnbDone } from "../engine/onbPersist";
import { stages } from "../engine/stages";
import { useOnbEngine } from "../engine/useOnbEngine";
import OnbLayout from "../layout/OnbLayout";
import { SceneProps } from "../layout/OnbLayout.types";
import SceneChat from "./SceneChat";
import SceneCheckin from "./SceneCheckin";
import SceneMain from "./SceneMain";
import ScenePlaying from "./ScenePlaying";
import SceneSteps from "./SceneSteps";

export const sceneMap: Record<string, React.ComponentType<SceneProps>> = {
  main: SceneMain,
  "main-w-goal-step": SceneMain,
  "main-w-urgent": SceneMain,
  chat: SceneChat,
  "chat-adjust": SceneChat,
  "goal-steps-modal": SceneSteps,
  "daily-checkin-modal": SceneCheckin,
  "step-playing-modal": ScenePlaying,
};

export default function OnboardingScenes() {
  // null: 초기 로딩(깜빡임 방지), true: 표시, false: 숨김
  const [open, setOpen] = useState<boolean | null>(null);

  // 첫 마운트에 완료 플래그 확인
  useEffect(() => {
    setOpen(!getOnbDone()); // 완료되어 있으면 열지 않음
  }, []);

  // 완료 처리: 플래그 저장 후 닫기
  const handleComplete = useCallback(() => {
    setOnbDone();
    setOpen(false);
  }, []);

  // useOnbEngine이 onComplete 옵션을 지원한다면:
  const engine = useOnbEngine(stages, "start", { onComplete: handleComplete });

  // 로딩 단계에선 아무것도 렌더하지 않음(SSR 깜빡임 방지용)
  if (open === null) return null;
  if (!open) return null;

  // onComplete 옵션이 없다면 아래처럼 마지막 단계에서 직접 handleComplete() 호출해도 됨
  const isLast = engine.activeIndex === engine.stages.length - 1;

  return (
    <OnbLayout
      sceneMap={sceneMap}
      stages={engine.stages}
      activeIndex={engine.activeIndex}
      onPrev={engine.prev}
      onNext={() => {
        if (isLast) return handleComplete();
        engine.next();
      }}
      onSkip={handleComplete}
    />
  );
}
