// src/pages/home/onboarding/scenes/index.ts
import { useState } from "react";

import { stages } from "../engine/stages";
// import { stages as initialStages } from "../onboarding/engine/stages";
import { useOnbEngine } from "../engine/useOnbEngine";
// import type { SceneProps } from "../layout/OnbLayout";
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
  const engine = useOnbEngine(stages, "start");
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <OnbLayout
      sceneMap={sceneMap}
      stages={engine.stages}
      activeIndex={engine.activeIndex}
      onPrev={engine.prev}
      onNext={() => {
        if (engine.activeIndex === engine.stages.length - 1) return setOpen(false);
        engine.next();
      }}
      onSkip={() => setOpen(false)}
      // initialStageId="start"
    />
  );
}
