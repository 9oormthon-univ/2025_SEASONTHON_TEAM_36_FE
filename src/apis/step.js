// src/apis/step.js
import mainApi from "./index";

const BASE = "/api/v1/steps";

/** [GET] ToDo의 Step 목록 조회 */
export async function fetchSteps(todoId) {
  if (todoId == null) throw new Error("Step 목록 조회를 위해 todoId가 필요합니다.");
  try {
    const { data } = await mainApi.get(`${BASE}/todos/${todoId}`, {
      headers: { Accept: "application/json" },
    });
    return data; // 서버 응답 그대로
  } catch (err) {
    const status = err?.response?.status;
    if (status === 403) throw new Error("ToDo에 접근할 권한이 없습니다.");
    if (status === 404) throw new Error("ToDo를 찾을 수 없습니다.");
    throw err;
  }
}

/** [POST] Step 기록 시작 */
export async function startStep(stepId) {
  if (stepId == null) throw new Error("Step 기록 시작을 위해 stepId가 필요합니다.");
  try {
    const { data } = await mainApi.post(`${BASE}/${stepId}/start`, null, {
      headers: { Accept: "application/json" },
    });
    return data; // { stepId, userId, startTime, endTime, duration }
  } catch (err) {
    const status = err?.response?.status;
    if (status === 403) throw new Error("Step에 접근할 권한이 없습니다.");
    throw err;
  }
}

/** [POST] Step 기록 종료 */
export async function stopStep(stepId) {
  if (stepId == null) throw new Error("Step 기록 종료를 위해 stepId가 필요합니다.");
  try {
    const { data } = await mainApi.post(`${BASE}/${stepId}/stop`, null, {
      headers: { Accept: "application/json" },
    });
    return data; // { stepId, userId, startTime, endTime, duration }
  } catch (err) {
    const status = err?.response?.status;
    if (status === 403) throw new Error("Step에 접근할 권한이 없습니다.");
    if (status === 404) throw new Error("시작되지 않은 Step입니다.");
    throw err;
  }
}

export default {
  fetchSteps,
  startStep,
  stopStep,
};
