import { useCallback, useEffect, useMemo, useState } from "react";

import { editUserProfile, getUserProfile } from "@/apis/user";
import type { RespUserProfile, School } from "@/common/types/response/user";

/* ===== 한국어 라벨 ↔ 서버 enum 매핑 ===== */
export const SCHOOL_OPTIONS = ["초등학교", "중학교", "고등학교", "대학교"] as const;
export type SchoolType = (typeof SCHOOL_OPTIONS)[number];

export const KOR_TO_SCHOOL: Record<SchoolType, School> = {
  초등학교: "ELEMENTARY",
  중학교: "MIDDLE",
  고등학교: "HIGH",
  대학교: "UNIVERSITY",
};
export const SCHOOL_TO_KOR: Record<School, SchoolType> = {
  ELEMENTARY: "초등학교",
  MIDDLE: "중학교",
  HIGH: "고등학교",
  UNIVERSITY: "대학교",
};

export const GRADE_OPTIONS: Record<SchoolType, number[]> = {
  초등학교: [1, 2, 3, 4, 5, 6],
  중학교: [1, 2, 3],
  고등학교: [1, 2, 3],
  대학교: [1, 2, 3, 4],
};

type SavingField = null | "age" | "school" | "grade";

export interface UseUserProfileOptions {
  /** true일 때 자동으로 프로필을 불러옴 (모달 open 값 연결) */
  enabled?: boolean;
}

export function useUserProfile({ enabled = true }: UseUserProfileOptions = {}) {
  // 서버 데이터(뷰 상태)
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [school, setSchool] = useState<SchoolType | null>(null);
  const [grade, setGrade] = useState<number | null>(null);

  // 서버 통신 상태
  const [loading, setLoading] = useState(false); // 조회 중
  const [savingField, setSavingField] = useState<SavingField>(null); // 즉시 저장 중
  const [error, setError] = useState<string | null>(null);

  const gradeList = useMemo(() => (school ? GRADE_OPTIONS[school] : []), [school]);

  // ===== 내부: 서버 응답 → 로컬 동기화 =====
  const applyServerUser = useCallback((data: RespUserProfile) => {
    setUserName(data.nickname || data.email || "사용자");
    setAvatar(data.profileImage ?? null);
    setAge(Number.isFinite(data.age) ? data.age : null);
    setSchool(SCHOOL_TO_KOR[data.school] ?? null);
    setGrade(Number.isFinite(data.grade) && data.grade > 0 ? data.grade : null);
  }, []);

  // ===== 조회 =====
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await getUserProfile()) as RespUserProfile;
      applyServerUser(data);
    } catch (e) {
      setError("프로필 정보를 불러오지 못했습니다.");

      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [applyServerUser]);

  // enabled일 때 자동 로드
  useEffect(() => {
    if (!enabled) return;
    void fetchProfile();
  }, [enabled, fetchProfile]);

  // ===== 공통 저장(낙관적 + 실패 시 롤백) =====
  const savePartial = useCallback(
    async (
      patch: { age?: number; school?: School; grade?: number },
      field: Exclude<SavingField, null>,
    ) => {
      const prev = { age, school, grade }; // rollback snapshot
      try {
        setSavingField(field);
        setError(null);
        const updated = (await editUserProfile(patch)) as RespUserProfile;
        applyServerUser(updated);
      } catch (e) {
        console.error(e);
        setError("저장 중 문제가 발생했습니다. 변경이 되돌려졌습니다.");
        // rollback
        setAge(prev.age);
        setSchool(prev.school);
        setGrade(prev.grade);
      } finally {
        setSavingField(null);
      }
    },
    [age, school, grade, applyServerUser],
  );

  // ===== 공개 API: 즉시 저장 액션들 =====
  const changeAge = useCallback(
    (nextAge: number) => {
      // 낙관적
      setAge(nextAge);
      void savePartial({ age: nextAge }, "age");
    },
    [savePartial],
  );

  const changeSchool = useCallback(
    (nextSchoolKor: SchoolType) => {
      // 낙관적
      setSchool(nextSchoolKor);
      setGrade(null); // 학교 변경 시 학년 초기화
      void savePartial({ school: KOR_TO_SCHOOL[nextSchoolKor] }, "school");
    },
    [savePartial],
  );

  const changeGrade = useCallback(
    (nextGrade: number) => {
      // 낙관적
      setGrade(nextGrade);
      void savePartial({ grade: nextGrade }, "grade");
    },
    [savePartial],
  );

  return {
    // 상태
    avatar,
    userName,
    age,
    school,
    grade,
    gradeList,
    loading,
    savingField,
    error,

    // 액션
    fetchProfile,
    changeAge,
    changeSchool,
    changeGrade,
  };
}
