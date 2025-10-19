import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  overflow-x: hidden;
  margin-top: clamp(36px, calc(36px + ((100vh - 667px) * 40 / 225)), 76px);
  margin-bottom: clamp(20px, calc(20px + ((100vh - 667px) * 16 / 225)), 36px);
`;

export const Wrapper = styled.div`
  width: min(100%, 600px);
`;

export const Header = styled.header`
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h2`
  text-align: center;
`;

export const SizedBox = styled.div`
  height: 40px;
`;

export const Text = styled.h3`
  margin-bottom: 20px;
`;
