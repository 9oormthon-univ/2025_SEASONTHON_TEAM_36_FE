import { RespTodoSteps } from "@/common/types/response/step";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/ai";

export async function destructToDoByAI(todoId: number, options: { signal?: AbortSignal } = {}) {
  return handleApiRequest<RespTodoSteps>(() =>
    mainApi.post(`${BASE}/${todoId}/generate`, {
      headers: { "Content-Type": "application/json" },
      signal: options.signal,
    }),
  );
}

export default {
  destructToDoByAI,
};
