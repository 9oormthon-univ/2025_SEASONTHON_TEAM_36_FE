import React from "react";
import styled from "styled-components";

import addPhotoIcon from "@/assets/images/add.svg";
// import EmotionSelector from "./components/EmotionSelector";
import imgC from "@/assets/images/frog-face-1.svg";
import imgA from "@/assets/images/frog-face-5.svg";
import imgB from "@/assets/images/places/cafe.svg";
import ModeToggle from "./components/ModeToggle";
import Weekly from "./Weekly";
import Daily from "./Daily";




// TODO: 실제 데이터 props 또는 API 연결 필요
export default function Profile() {

  const [mode, setMode] = React.useState("weekly"); // "daily" | "weekly"

  return (
    <Page>
      <ProfileBar >
        <ProfileText className="typo-h3">구르미님의 기록</ProfileText>
      </ProfileBar>
      <ModeToggle
        aria-label="기간 모드 선택"
        value={mode}
        onChange={setMode}
        options={[
          { value: "weekly", label: "주간" },
          { value: "daily", label: "일간" },
        ]}
      />
      {mode === "daily" ? <Daily /> : <Weekly />}

    </Page>
  );
}

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 16px;
  background: var(--bg-1);
  color: var(--text-1);
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ProfileBar = styled.h3`
  position: sticky;
  top: 0;
  margin-left: 10px;
  background: var(--bg-1);
  padding: 10px 0 12px;
  color: var(--text-1, #000);
`;
const ProfileText = styled.h2`
  margin: 0;
  color: var(--text-1);
`;


const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  color: var(--text-1);
  margin: 10px 0;
`;

const MemoFieldWrap = styled.div`
  position: relative;
  padding: 6px 0 10px;                /* 아래 여백으로 밑줄과 간격 */
  border-bottom: 1px solid var(--natural-400);
  transition: border-color 150ms ease;
  &:focus-within {
    border-bottom-color: var(--primary-1);  /* 포커스 시 강조 */
  }
`;

const MemoInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-family: var(--ff-sans);
  font-size: var(--fs-sm);
  line-height: 1.4;
  resize: none;                         /* 필요시 vertical로 변경 */
  box-sizing: border-box;
  padding-right: 56px;                  /* 우측 카운터 자리 */
  /* iOS 확대 방지 */
  -webkit-text-size-adjust: 100%;

  ::placeholder {
    color: var(--text-3);
  }
`;

const PhotoBox = styled.div`
  width: 100%;
  height: 150px;
  background:var(--natural-400);
  border: 1px solid var(--natural-400);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 50px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
`;



/* ===== styled-components ===== */
const Row = styled.div`
  display: flex;
  justify-content: space-around; /* 균등 분배 */
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
`;

const Title = styled.div`
  color: var(--text-1);
`;

const ImageWrapper = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 2px 0;
`;
const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  min-width: 0; /* ellipsis를 위해 필요 */
  > span {
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 64vw; /* 이름이 길 때 줄바꿈 대신 말줄임 */
  }
`;

const InlineCounter = styled.div`
  position: absolute;
  right: 0;
  bottom: 10px;                         /* 밑줄 윗부분에 맞춤 */
  color: var(--text-3);
`;
