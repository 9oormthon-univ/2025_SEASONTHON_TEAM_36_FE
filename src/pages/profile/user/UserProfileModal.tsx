import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import avatarSvg from "@/assets/images/avatar.svg";

import PageModal from "../../../common/components/PageModal";

interface UserProfileModalProps {
  open: boolean;
  onClose?: () => void;
}

const SCHOOL_OPTIONS = ["초등학교", "중학교", "고등학교", "대학교"] as const;
type SchoolType = (typeof SCHOOL_OPTIONS)[number];
const GRADE_OPTIONS: Record<SchoolType, number[]> = {
  초등학교: [1, 2, 3, 4, 5, 6],
  중학교: [1, 2, 3],
  고등학교: [1, 2, 3],
  대학교: [1, 2, 3, 4],
};

export default function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const [userName, setUserName] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [school, setSchool] = useState<SchoolType | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [openSchool, setOpenSchool] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);

  const gradeList = useMemo(() => (school ? GRADE_OPTIONS[school] : []), [school]);

  useEffect(() => {
    // TODO: API에서 이름을 가져와 1회 세팅
    setUserName("최유안");
  }, []); // 의존성 비움: 최초 마운트 때 한 번만 실행

  return (
    <PageModal open={open} onClose={onClose} headerVariant="back-left">
      <Sheet>
        {/* 상단 */}
        <ProfileHeader>
          <AvatarImg src={avatarSvg} alt="프로필 아바타" draggable={false} />
          <NameLabel aria-label="이름" className="typo-h2">
            {userName || "이름"}
          </NameLabel>
        </ProfileHeader>

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
                if (!Number.isNaN(n) && n > 0 && n < 120) setAge(n);
              }}
            >
              입력하기
            </InlineAction>
          ) : (
            <InlineValue className="typo-label-m">{age}살</InlineValue>
          )}
        </Row>
        <DividerThin />

        {/* 학교 / 학년 - 한 줄 */}
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
                      setSchool(opt);
                      setGrade(null);
                      setOpenSchool(false);
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
                      setGrade(g);
                      setOpenGrade(false);
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
          <ActionItem className="typo-label-l" type="button" onClick={() => alert("로그아웃")}>
            로그아웃
          </ActionItem>
          <ActionItem className="typo-label-l" type="button" onClick={() => alert("탈퇴")}>
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
  gap: 28px;
  padding: 8px 0 4px;
`;

const AvatarImg = styled.img`
  inline-size: 48vw;
  block-size: 48vw;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover; /* SVG도 문제없지만, 래스터 이미지 대응 */
  user-select: none;
  pointer-events: none;
`;

const NameLabel = styled.div`
  color: var(--text-1, #000);
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
  min-height: var(--row-h); /* ActionList와 동일 높이 */
  align-items: center; /* 버튼 수직 중앙 정렬 */
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
  color: #111;
  border-bottom: 1px solid var(--natural-400);
`;

const Caret = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 9L12 15L6 9"
      stroke="#969BA5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
