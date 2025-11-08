// FrogPage.jsx
import styled from "styled-components";

interface FrogNotiProps {
  topText: string;
  imageSrc: string;
  bottomText: string;
}

export default function FrogNoti({
  topText = "", //
  imageSrc, // 개구리 이미지를 받아옴
  bottomText = "",
}: FrogNotiProps) {
  return (
    <Container>
      <TopText>{topText}</TopText>
      {imageSrc && <FrogImg src={imageSrc} alt="" />}
      <BottomText>{bottomText}</BottomText>
    </Container>
  );
}

const Container = styled.div`
  height: 100%; /* 화면 전체 높이 사용 */
  display: grid;
  align-items: center; /* 각 셀 안에서 세로 중앙 */
  justify-items: center; /* 가로 중앙 */
  align-content: center; /* 전체 그리드를 세로 중앙 정렬 */
  background: var(--bg-1);
  color: var(--text-1);
  text-align: center;
  gap: 9%; /* 위-중간-아래 간격 */
  transform: translateY(-5%);
`;

const TopText = styled.h2`
  color: var(--text-1, #000);
  text-align: center;
  white-space: pre-wrap;
  line-height: 1.7;
`;

const FrogImg = styled.img`
  width: 60%;
  height: auto;
`;

const BottomText = styled.h3`
  color: var(--text-3, #666);
  text-align: center;
  white-space: pre-wrap;
`;
