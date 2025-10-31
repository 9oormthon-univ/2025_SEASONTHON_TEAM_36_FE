export type School = "ELEMENTARY" | "MIDDLE" | "HIGH" | "UNIVERSITY"; // 실제 enum 값 일치시킬 필요 있음

/** GET /api/v1/users/my-page 응답 */

export interface RespUserProfile {
  userId: number;
  email: string;
  nickname: string;
  kakaoId: number;
  profileImage: string | null; // 서버가 null 허용이면 null, 아니면 string으로 변경
  age: number;
  school: School;
  grade: number;
}

/** PUT /api/v1/users/my-page 요청 (입력 안 한 필드는 기존 값 유지) */
export interface EditUserProfileReq {
  age?: number;
  school?: School;
  grade?: number;
}
