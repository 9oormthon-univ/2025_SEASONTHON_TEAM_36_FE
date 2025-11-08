export type Placement = "bottom" | "center" | "auto"; // body 표시 위치

export interface OnbStage {
  id: string;
  title?: string; // (거의 사용 안할 예정)
  body?: string;
  placement?: Placement;
  pulse?: boolean; // pulse 하이라이트
  sceneKey?: string; // 복제 스크린 사용 시 키
  sceneZIndex?: number; // 복제 스크린 z-index
  /** 같은 scene 재사용 시 강조 타깃을 분기하기 위한 키(단일 혹은 여러 개) */
  componenetKey?: string | string[];
}

export const stages: OnbStage[] = [
  {
    id: "start",
    body: "사용법을 알아봅시다!",
    placement: "bottom",
    sceneKey: "main",
  },
  {
    id: "chatbot-icon",
    body: "우측 상단에 AI 개구리를\n눌러보세요!",
    placement: "bottom",
    sceneKey: "main",
    componenetKey: "chatbot",
  },
  {
    id: "make-todo",
    body: "AI 개구리 'Rana'와의 대화를 통해서\n학습 계획을 수립할 수 있어요!",
    placement: "bottom",
    sceneKey: "chat",
  },
  {
    id: "check-todo",
    body: "수립된 계획을 확인해볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
  },
  {
    id: "sheet-scroll",
    body: "드래그 해서 올려보세요!",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componenetKey: "bottom-sheet",
  },
  {
    id: "sheet-content",
    body: "오늘의 할 일과 기간을 놓쳐\n수행하지 못한 일을 확인할 수 있어요!",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componenetKey: "bottom-sheet",
  },
  {
    id: "goal-frog",
    body: "이번엔 개구리를 눌러볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componenetKey: "goal-card",
  },
  {
    id: "goal-steps",
    body: "내가 해야 할 일의 전체적인\n계획을 파악할 수 있어요!",
    placement: "bottom",
    sceneKey: "goal-steps-modal",
  },
  {
    id: "urgent",
    body: "계획 마감일이 임박한다면...",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
  },
  {
    id: "siren",
    body: "경고등이 켜져요!",
    placement: "auto",
    pulse: true,
    sceneKey: "main-w-urgent",
    componenetKey: "big-siren",
  },
  {
    id: "adjust",
    body: "기한 내에 계획대로 일을\n마치기 어려울 것 같다구요?",
    placement: "bottom",
    sceneKey: "main-w-urgent",
  },
  {
    id: "adjust-icon",
    body: "걱정마세요!",
    placement: "bottom",
    sceneKey: "main-w-urgent",
    componenetKey: "siren",
  },
  {
    id: "adjust-chat",
    body: "AI 개구리 'Rana'와의 대화를 통해\n다시 계획을 수립하고 재도전\n할 수 있답니다!😁",
    placement: "bottom",
    sceneKey: "chat-adjust",
  },
  {
    id: "play-btn",
    body: "이번엔 플레이 버튼을 눌러볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componenetKey: "play-btn",
  },
  {
    id: "daily-chkin",
    body: "일을 시작하기 전 나의\n상태를 돌아봐요!",
    placement: "bottom",
    sceneKey: "daily-checkin-modal",
  },
  {
    id: "day-start",
    body: "이제 일을 시작해 볼까요?",
    placement: "bottom",
    sceneKey: "daily-checkin-modal",
    componenetKey: "start-btn",
  },
  {
    id: "playing",
    body: "중간에 쉬고 싶다면⏸️버튼을,\n일을 끝냈다면✅버튼을\n눌러주세요!",
    placement: "bottom",
    sceneKey: "step-playing-modal",
  },
  {
    id: "end",
    body: "자, 이제 우물 밖으로 나가볼까요?",
    placement: "center",
    sceneKey: "main",
  },
];
