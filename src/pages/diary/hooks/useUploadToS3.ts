// src/hooks/useUploadToS3.ts
import { useCallback, useState } from "react";

import { uploadImageToS3 } from "@/apis/s3Image";

export type S3UploadResult = { key: string; url: string };

type UseUploadToS3Return = {
  upload: (file: File) => Promise<S3UploadResult>;
  uploading: boolean;
  progress: number; // 0~100
  error: Error | null;
  result: S3UploadResult | null;
  reset: () => void;
  /** <input type="file" />에 바로 바인딩해서 사용할 수 있는 헬퍼 */
  bindInput: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

/**
 * 단일 파일을 S3에 업로드하는 훅
 * - 내부적으로 /api/v1/s3/presigned → S3 PUT 순으로 처리
 */
export function useUploadToS3(): UseUploadToS3Return {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<S3UploadResult | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const res = await uploadImageToS3(file, p => setProgress(p ?? 0));
      setResult(res);
      setProgress(100);
      setUploading(false);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      setUploading(false);
      throw err;
    }
  }, []);

  const bindInput = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // fire-and-forget; 상위에서 await 하고 싶으면 직접 upload(file) 호출
        void upload(file);
      }
      // 같은 파일 재선택을 허용하려면 value 초기화
      e.currentTarget.value = "";
    },
  };

  return { upload, uploading, progress, error, result, reset, bindInput };
}
