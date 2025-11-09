import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 8%;
`;

export const Wrapper = styled.div`
  text-align: center;
`;

export const Message = styled.h3`
  white-space: pre-line;
  color: #6f737b;
  font-size: 24px;
  font-weight: 500;
  line-height: 64px;
  letter-spacing: -0.25px;
  text-align: center;
`;

export const Button = styled.button`
  background-color: #0e7400;
  border-radius: 41px;
  padding: 24px 88px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
`;

export const OutOfWell = styled.img`
  width: 100%;
  max-width: 208px;
`;
