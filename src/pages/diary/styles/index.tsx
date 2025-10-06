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
`;

export const Title = styled.h1`
  color: white;
  font-size: var(--fs-2xl);
`;

export const Message = styled.h3`
  font-size: var(--fs-md);
  margin-top: 47px;
  color: white;
`;
