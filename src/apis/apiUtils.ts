import axios from "axios";

import { ErrorResponse } from "@/common/types/error";

// API 요청 처리를 위한 공통 함수
export async function handleApiRequest<T>(
  requestFn: () => Promise<{ data: T }>,
): Promise<T | ErrorResponse | string> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data || error.message);
      return error.response?.data as ErrorResponse;
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error:", errorMessage);
      return errorMessage;
    }
  }
}
