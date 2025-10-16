// src/apis/step.js
import { ErrorResponse } from "react-router-dom";

import type { reqUpdateSteps } from "@/common/types/request/step";
import type { RespStepInfo, RespStepRecord, RespTodoSteps } from "@/common/types/response/step";

import { handleApiRequest } from "./apiUtils";
import mainApi from "./index";

const BASE = "/api/v1/steps";

/** [GET] ToDo의 Step 목록 조회 */
export async function fetchSteps(todoId: number) {
  if (todoId == null) throw new Error("Step 목록 조회를 위해 todoId가 필요합니다.");
  return handleApiRequest<RespTodoSteps>(() =>
    mainApi.get(`${BASE}/todos/${todoId}`, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] Step 기록 시작 */
export async function startStep(stepId: number) {
  if (stepId == null) throw new Error("Step 기록 시작을 위해 stepId가 필요합니다.");
  return handleApiRequest<RespStepRecord>(() =>
    mainApi.post(`${BASE}/${stepId}/start`, null, {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] Step 기록 종료 */
export async function stopStep(stepId: number) {
  if (stepId == null) throw new Error("Step 기록 종료를 위해 stepId가 필요합니다.");
  return handleApiRequest<RespStepRecord>(() =>
    mainApi.post(`${BASE}/${stepId}/stop`, null, {
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

export default {
  fetchSteps,
  startStep,
  stopStep,
  modifyStep,
  modifySteps,
  deleteStep,
};
