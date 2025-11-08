import { RespTodoSteps } from "@/common/types/response/step";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/ai";

/**
 * [POST] AI ToDo 분해
 * @param todoId To-Do ID
 * @param options API 요청 중지 시그널 설정
 * @returns Promise<RespTodoSteps>
 */
export async function destructToDoByAI(todoId: number, options: { signal?: AbortSignal } = {}) {
  return handleApiRequest<RespTodoSteps>(() =>
    mainApi.post(`${BASE}/${todoId}/generate`, {
      headers: { "Content-Type": "application/json" },
      signal: options.signal,
    }),
  );
}

/**
 * [POST] 챗봇에 메시지 전송
 * @param userId SSE 서버에 구독된 사용자 ID
 * @param message 챗봇에 전송할 메시지
 * @returns
 */
export async function sendMessage(userId: number, message: string) {
  return handleApiRequest<void>(() =>
    mainApi.post(
      `${BASE}/send`,
      {
        message: message,
      },
      {
        headers: { "Content-Type": "application/json" },
        params: {
          userId: userId,
        },
      },
    ),
  );
}

/**
 * [POST] SSE 연결 해제
 * @param userId SSE 연결 해제를 요청하는 사용자 ID
 * @returns string 타입의 body
 */
export async function disconnectSSE(userId: number) {
  return handleApiRequest<string>(() =>
    mainApi.post(`${BASE}/disconnect`, null, {
      params: {
        userId: userId,
      },
    }),
  );
}

/**
 * [GET] SSE 연결
 * @param userId SSE 연결을 요청한 사용자 ID
 * @returns object - timeout: 서버 연결 제한시간
 */
export async function connectSSE(userId: number) {
  return handleApiRequest<{ timeout: number }>(() =>
    mainApi.get(`${BASE}/disconnect`, {
      headers: {
        Accept: "text/event-stream",
      },
      params: {
        userId: userId,
      },
    }),
  );
}

export default {
  sendMessage,
  connectSSE,
  disconnectSSE,
};
