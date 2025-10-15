import styled from "styled-components";

// Illust 컴포넌트에서 사용하던 이미지를 직접 가져옵니다.
import frogWell from "@/assets/images/frog-well.png";

export default function EmptyState({
  title = "오늘은 하루가 비어있어요!",
  subtitle = "캘린더에서 업무를 추가해 주세요.",
}) {
  return (
    <Container>
      <Illustration>
        <img src={frogWell} alt="우물 속 개구리 캐릭터" />
      </Illustration>

      <TextBox>
        <Message className="typo-h3">{title}</Message>
        <SubMessage className="typo-h3">{subtitle}</SubMessage>
      </TextBox>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Illustration = styled.figure`
  /* 기본 (세로가 짧은 모바일) - 상하 마진 축소 */
  margin: 8% 0;
  width: 100%;
  display: flex;
  justify-content: center;

  /* 세로가 700px 이상인 기기 대응 */
  @media (min-height: 700px) {
    margin: 20% 0 18%;
  }

  img {
    width: clamp(200px, 68vw, 320px);
    height: auto;
    display: block;
    user-select: none;
    pointer-events: none;
  }
`;

const TextBox = styled.div`
  margin-top: 4px;
  color: var(--text-2);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Message = styled.p``;
const SubMessage = styled.p``;
