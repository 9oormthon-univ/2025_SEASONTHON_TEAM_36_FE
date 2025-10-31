import { useState } from "react";
import styled from "styled-components";

import avatarSvg from "@/assets/images/avatar.svg";

import PageModal from "../../../common/components/PageModal";
import { SCHOOL_OPTIONS, useUserProfile } from "./hooks/useUserProfile";

interface UserProfileModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  // 서버 통신/상태는 전부 커스텀 훅으로 이전
  const {
    avatar,
    userName,
    age,
    school,
    grade,
    gradeList,
    loading,
    savingField,
    error,
    changeAge,
    changeSchool,
    changeGrade,
  } = useUserProfile({ enabled: open });

  // UI-only 상태
  const [openSchool, setOpenSchool] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);

  // (선택) gradeList를 훅에서 주지만, UI에서 재계산하고 싶다면 이렇게도 가능
  // const gradeList = useMemo(() => (school ? GRADE_OPTIONS[school] : []), [school]);

  return (
    <PageModal open={open} onClose={onClose} headerVariant="back-left">
      <Sheet aria-busy={loading || Boolean(savingField)}>
        {/* 상단 */}
        <ProfileHeader>
          <AvatarImg
            src={avatar || avatarSvg}
            alt="프로필 아바타"
            draggable={false}
            aria-label="프로필 이미지"
          />
          <NameLabel aria-label="이름" className="typo-h2">
            {userName || "이름"}
          </NameLabel>
          {error && <ErrorText role="alert">{error}</ErrorText>}
        </ProfileHeader>

        {/* 나이 */}
        <Row>
          <InlineLabel className="typo-label-l">나이</InlineLabel>
          {age == null ? (
            <InlineAction
              className="typo-label-m"
              type="button"
              onClick={() => {
                const v = prompt("나이를 입력하세요 (숫자)"); // 🫠🫠 UI 없음
                if (!v) return;
                const n = Number(v);
                if (!Number.isNaN(n) && n > 0 && n < 120) {
                  // eslint가 경고하지 않도록 명시적으로 void 처리
                  void changeAge(n);
                }
              }}
              disabled={savingField === "age" || loading}
            >
              입력하기
            </InlineAction>
          ) : (
            <InlineValue className="typo-label-m">{age}살</InlineValue>
          )}
        </Row>
        <DividerThin />

        {/* 학교 / 학년 */}
        <SelectRow>
          <SelectBox>
            <SelectButton
              className="typo-label-l"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openSchool}
              onClick={() => {
                setOpenSchool(v => !v);
                setOpenGrade(false);
              }}
              disabled={loading || savingField === "school"}
            >
              <span>{school ?? "학교"}</span>
              <span>{Caret}</span>
            </SelectButton>

            {openSchool && (
              <Dropdown role="listbox">
                {SCHOOL_OPTIONS.map(opt => (
                  <DropdownItem
                    key={opt}
                    role="option"
                    aria-selected={school === opt}
                    onClick={() => {
                      setOpenSchool(false);
                      void changeSchool(opt);
                    }}
                  >
                    {opt}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </SelectBox>

          <SelectBox>
            <SelectButton
              className="typo-label-l"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openGrade}
              onClick={() => {
                if (!school) {
                  alert("학교를 먼저 선택해 주세요.");
                  return;
                }
                setOpenGrade(v => !v);
                setOpenSchool(false);
              }}
              disabled={loading || savingField === "grade" || !school}
            >
              <span>{grade ? `${grade}학년` : "학년"}</span>
              <span>{Caret}</span>
            </SelectButton>

            {openGrade && school && (
              <Dropdown role="listbox">
                {gradeList.map(g => (
                  <DropdownItem
                    key={g}
                    role="option"
                    aria-selected={grade === g}
                    onClick={() => {
                      setOpenGrade(false);
                      void changeGrade(g);
                    }}
                  >
                    {g}학년
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </SelectBox>
        </SelectRow>
        <DividerThin />

        {/* 하단 액션 */}
        <ActionList>
          <ActionItem
            className="typo-label-l"
            type="button"
            onClick={() => alert("로그아웃")}
            disabled={loading || Boolean(savingField)}
          >
            로그아웃
          </ActionItem>
          <ActionItem
            className="typo-label-l"
            type="button"
            onClick={() => alert("탈퇴")}
            disabled={loading || Boolean(savingField)}
          >
            탈퇴
          </ActionItem>
        </ActionList>
      </Sheet>
    </PageModal>
  );
}

/* ===== Styles ===== */
const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const ProfileHeader = styled.header`
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 8px 0 4px;
`;

const AvatarImg = styled.img`
  inline-size: 48vw;
  block-size: 48vw;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
`;

const NameLabel = styled.div`
  color: var(--text-1, #000);
`;

const ErrorText = styled.p`
  margin: 0;
  color: #d92d20;
  font-size: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-bottom: 1px solid var(--natural-400);
  height: 48px;
`;
const InlineLabel = styled.span`
  color: var(--text-1, #000);
`;
const InlineValue = styled.span`
  color: var(--text-2);
`;
const InlineAction = styled.button`
  position: relative;
  color: var(--text-2);
  cursor: pointer;
  padding-left: 12px;
  background: transparent;
  border: none;
  &::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 50%;
    width: 1px;
    height: 12px;
    background: #cfd4dc;
    transform: translateY(-50%);
  }
`;
const DividerThin = styled.hr`
  border: none;
  border-top: 1px solid #e6e9ef;
  margin: 0;
`;
const SelectRow = styled.div`
  padding: 0 12px;
  display: flex;
  gap: 12px;
  min-height: 48px;
  align-items: center;
  justify-items: start;
  position: relative;
  border-bottom: 1px solid var(--natural-400);
`;
const SelectBox = styled.div`
  position: relative;
  max-width: 100%;
`;
const SelectButton = styled.button`
  width: auto;
  gap: 4px;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: var(--text-1, #000);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 20px);
  left: -12px;
  right: 0;
  width: 100px;
  max-height: 240px;
  overflow: auto;
  background: var(--bg-1);
  border: 1px solid #e5e8ee;
  padding: 8px;
  display: grid;
  z-index: 20;
  border-radius: 11px;
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
`;
const DropdownItem = styled.li`
  list-style: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-1);
`;
const ActionList = styled.div`
  display: grid;
  grid-auto-rows: 48px;
  margin-top: auto;
  margin-bottom: 12px;
`;
const ActionItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0 18px;
  border: none;
  background: transparent;
  color: #111;
  border-bottom: 1px solid var(--natural-400);
`;

const Caret = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 9L12 15L6 9"
      stroke="#969BA5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
