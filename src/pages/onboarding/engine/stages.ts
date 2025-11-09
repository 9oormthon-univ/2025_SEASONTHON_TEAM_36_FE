export type Placement = "bottom" | "center" | "auto"; // body 표시 위치
export type HintAnim = "fade-up" | "float" | "pulse" | "slide-up" | "typing";

export interface OnbStage {
  id: string;
  title?: string;
  body?: string;
  placement?: Placement;
  pulse?: boolean;
  sceneKey?: string;
  sceneZIndex?: number;
  componentKey?: string | string[];
  hintAnim?: HintAnim;
  hintDurationMs?: number;
}

export const stages: OnbStage[] = [
  {
    id: "start",
    body: "사용법을 알아봅시다!",
    placement: "bottom",
    sceneKey: "main",
    hintAnim: "fade-up",
    hintDurationMs: 800,
  },
  {
    id: "chatbot-icon",
    body: "우측 상단에 AI 개구리를\n눌러보세요!",
    placement: "bottom",
    sceneKey: "main",
    componentKey: "chatbot",
    hintAnim: "float",
    hintDurationMs: 2000,
  },
  {
    id: "make-todo",
    body: "AI 개구리 'Rana'와의 대화를 통해서\n학습 계획을 수립할 수 있어요!",
    placement: "bottom",
    sceneKey: "chat",
    hintAnim: "slide-up",
    hintDurationMs: 1400,
  },
  {
    id: "check-todo",
    body: "수립된 계획을 확인해볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    hintAnim: "fade-up",
    hintDurationMs: 900,
  },
  {
    id: "sheet-scroll",
    body: "드래그 해서 올려보세요!",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componentKey: "bottom-sheet",
    hintAnim: "slide-up",
    hintDurationMs: 1000,
  },
  {
    id: "sheet-content",
    body: "오늘의 할 일과 기간을 놓쳐\n수행하지 못한 일을 확인할 수 있어요!",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componentKey: "bottom-sheet",
    hintAnim: "fade-up",
    hintDurationMs: 900,
  },
  {
    id: "goal-frog",
    body: "이번엔 개구리를 눌러볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componentKey: "goal-card",
    hintAnim: "pulse",
    hintDurationMs: 1200,
  },
  {
    id: "goal-steps",
    body: "내가 해야 할 일의 전체적인\n계획을 파악할 수 있어요!",
    placement: "bottom",
    sceneKey: "goal-steps-modal",
    hintAnim: "slide-up",
    hintDurationMs: 2200,
  },
  {
    id: "urgent",
    body: "계획 마감일이 임박한다면...",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    hintAnim: "float",
    hintDurationMs: 2000,
  },
  {
    id: "siren",
    body: "경고등이 켜져요!",
    placement: "auto",
    pulse: true,
    sceneKey: "main-w-urgent",
    componentKey: "big-siren",
    hintAnim: "fade-up",
    hintDurationMs: 1500,
  },
  {
    id: "adjust",
    body: "기한 내에 계획대로 일을\n마치기 어려울 것 같다구요?",
    placement: "bottom",
    sceneKey: "main-w-urgent",
    hintAnim: "float",
    hintDurationMs: 2000,
  },
  {
    id: "adjust-icon",
    body: "걱정마세요!",
    placement: "bottom",
    sceneKey: "main-w-urgent",
    componentKey: "siren",
    hintAnim: "fade-up",
    hintDurationMs: 900,
  },
  {
    id: "adjust-chat",
    body: "AI 개구리 'Rana'와의 대화를 통해\n다시 계획을 수립하고 재도전\n할 수 있답니다!😁",
    placement: "bottom",
    sceneKey: "chat-adjust",
    hintAnim: "slide-up",
    hintDurationMs: 1600,
  },
  {
    id: "play-btn",
    body: "이번엔 플레이 버튼을 눌러볼까요?",
    placement: "bottom",
    sceneKey: "main-w-goal-step",
    componentKey: "play-btn",
    hintAnim: "pulse",
    hintDurationMs: 1000,
  },
  {
    id: "daily-chkin",
    body: "일을 시작하기 전 나의\n상태를 돌아봐요!",
    placement: "bottom",
    sceneKey: "daily-checkin-modal",
    hintAnim: "fade-up",
    hintDurationMs: 900,
  },
  {
    id: "day-start",
    body: "이제 일을 시작해 볼까요?",
    placement: "bottom",
    sceneKey: "daily-checkin-modal",
    componentKey: "start-btn",
    hintAnim: "slide-up",
    hintDurationMs: 900,
  },
  {
    id: "playing",
    body: "중간에 쉬고 싶다면⏸️버튼을,\n일을 끝냈다면✅버튼을\n눌러주세요!",
    placement: "bottom",
    sceneKey: "step-playing-modal",
    hintAnim: "fade-up",
    hintDurationMs: 900,
  },
  {
    id: "end",
    body: "자, 이제 우물 밖으로 나가볼까요?",
    placement: "center",
    sceneKey: "main",
    hintAnim: "float",
    hintDurationMs: 2600,
  },
];
