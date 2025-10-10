import styled from "styled-components";

export const Page = styled.div`
  /* Main 영역을 꽉 채우도록 flex 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
  width: 100%;
  height: 100vh;

  background-image: url("/night-sky.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 76px;
  padding: 12px 24px;

  @media (max-height: 800px) {
    margin-top: 50px;
  }

  @media (max-height: 700px) {
    margin-top: 40px;
  }

  @media (max-height: 600px) {
    margin-top: 30px;
  }

  @media (max-height: 500px) {
    margin-top: 20px;
  }
`;

export const Title = styled.h1`
  color: white;
  font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
`;

export const Message = styled.h3`
  font-size: clamp(var(--fs-sm), 2vw, var(--fs-md));
  font-weight: 500;
  margin-top: clamp(24px, 4vh, 38px);
  color: white;
`;
