// src/apis/s3Image.ts
import type { ErrorResponse } from "@/common/types/error";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

/** Presigned URL 응답 타입 */
export interface PresignedResp {
  uploadUrl: string;
  key: string;
}

/** 타입 가드 */
function isPresignedResp(v: unknown): v is PresignedResp {
  return !!v && typeof v === "object" && "uploadUrl" in v && "key" in v;
}
function isErrorResponse(v: unknown): v is ErrorResponse {
  return !!v && typeof v === "object" && "message" in v;
}

/** [POST] Presigned URL 발급 (query: fileName, fileType) */
export const requestPresignedUrl = (fileName: string, fileType: string) => {
  return handleApiRequest<PresignedResp>(() =>
    mainApi.post("/api/v1/s3/presigned", null, {
      params: { fileName, fileType },
      headers: { Accept: "application/json" },
    }),
  );
};

/**
 * Presigned URL로 실제 이미지를 업로드하고 key/최종 URL을 반환
 * - S3 PUT은 인증 인터셉터 영향을 피하려고 fetch 사용
 */
export const uploadImageToS3 = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ key: string; url: string }> => {
  const presigned = await requestPresignedUrl(file.name, file.type);

  // 🔒 타입 내로잉
  if (!isPresignedResp(presigned)) {
    const msg = isErrorResponse(presigned) ? presigned.message : "Presigned URL 발급 실패";
    throw new Error(msg);
  }

  const { uploadUrl, key } = presigned;

  // PUT 업로드(fetch) — Authorization 헤더가 섞이지 않도록 분리
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`S3 업로드 실패 (${res.status})`);
  }

  // 진행률 필요 시: fetch는 기본 제공 X. 필요하면 Axios 전용 인스턴스(인터셉터 미적용) 별도 생성이 안전.
  if (onProgress) onProgress(100);

  return { key, url: uploadUrl.split("?")[0] };
};
