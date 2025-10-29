// src/apis/step.js
import type { ReqPauseStopStep, ReqStartStep, reqUpdateSteps } from "@/common/types/request/step";
import type { RespStepInfo, RespStepRecord, RespTodoSteps } from "@/common/types/response/step";

import { handleApiRequest } from "./apiUtils";
import mainApi from "./index";

const BASE = "/api/v1/steps";
const RECORD_BASE = "/api/v1/step-records"; // step record 전용 base 추가

/** [GET] ToDo의 Step 목록 조회 */
export async function fetchSteps(todoId: number) {
  if (todoId == null) throw new Error("Step 목록 조회를 위해 todoId가 필요합니다.");
  return handleApiRequest<RespTodoSteps>(() =>
    mainApi.get(`${BASE}/todos/${todoId}`, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [PUT] Step 수정 */
export async function modifyStep(stepId: number, description: string | undefined) {
  if (stepId === null) throw new Error("Step 수정을 위해 stepId가 필요합니다.");
  if (description === undefined) throw new Error("description이 필요합니다.");
  return handleApiRequest<Array<RespStepInfo>>(() =>
    mainApi.put(
      `${BASE}/${stepId}`,
      {
        description: description,
      },
      {
        headers: { Accept: "application/json" },
      },
    ),
  );
}

/** [PUT] ToDo의 Step들 전체 수정 */
export async function modifySteps(todoId: number, payload: Array<reqUpdateSteps>) {
  if (todoId == null) throw new Error("Step 수정을 위해 todoId가 필요합니다.");
  return handleApiRequest<Array<RespStepInfo>>(() =>
    mainApi.put(`${BASE}/todo/${todoId}`, payload, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [DELETE] Step 삭제 */
export async function deleteStep(stepId: number) {
  if (stepId == null) throw new Error("Step 수정을 위해 stepId가 필요합니다.");
  return handleApiRequest<object>(() =>
    mainApi.delete(`${BASE}/${stepId}`, {
      headers: { Accept: "application/json" },
    }),
  );
}

//=========== Step Record APIs ===========

/** [POST] Step 기록 시작 */
export async function startStep(stepId: number, body: ReqStartStep) {
  if (stepId == null) throw new Error("Step 기록 시작을 위해 stepId가 필요합니다.");
  if (!body || typeof body.startTime !== "string") {
    throw new Error("startTime(string)이 필요합니다.");
  }
  return handleApiRequest<RespStepRecord>(() =>
    mainApi.post(`${RECORD_BASE}/${stepId}/start`, body, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] Step 기록 종료 */
export async function stopStep(stepId: number, body: ReqPauseStopStep) {
  if (stepId == null) throw new Error("Step 기록 종료를 위해 stepId가 필요합니다.");
  if (!body || typeof body.endTime !== "string" || typeof body.duration !== "number") {
    throw new Error("endTime(string)과 duration(number)이 필요합니다.");
  }
  return handleApiRequest<RespStepRecord>(() =>
    mainApi.post(`${RECORD_BASE}/${stepId}/stop`, body, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] Step 기록 일시정지 */
export async function pauseStep(stepId: number, body: ReqPauseStopStep) {
  if (stepId == null) throw new Error("Step 기록 일시정지를 위해 stepId가 필요합니다.");
  if (!body || typeof body.endTime !== "string" || typeof body.duration !== "number") {
    throw new Error("endTime(string)과 duration(number)이 필요합니다.");
  }
  return handleApiRequest<RespStepRecord>(() =>
    mainApi.post(`${RECORD_BASE}/${stepId}/pause`, body, {
      headers: { Accept: "application/json" },
    }),
  );
}

export default {
  fetchSteps,
  startStep,
  stopStep,
  modifyStep,
  modifySteps,
  deleteStep,
};
