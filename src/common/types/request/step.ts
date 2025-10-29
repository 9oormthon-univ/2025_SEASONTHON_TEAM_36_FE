export interface reqUpdateSteps {
  stepId: number;
  description: string;
}

export interface ReqStartStep {
  startTime: string; // ISO-8601 형식: "2025-10-29T06:29:16.643Z"
}
export interface ReqPauseStopStep {
  endTime: string; // ISO-8601 (e.g. "2025-10-29T06:00:24.183Z")
  duration: number; // 수행 시간 누적 전송 (단위는 서버 스펙에 따름)
}
