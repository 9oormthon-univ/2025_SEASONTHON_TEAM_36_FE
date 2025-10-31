import styled from "styled-components";

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

export const ChatBody = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
  overflow-y: auto;
`;

export const ChatDate = styled.span`
  text-align: center;
  font-size: 12px;
`;

export const Form = styled.form`
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
  padding: 14px 10px 14px 20px;
  position: sticky;
  bottom: 0;
  left: 0;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--green-500);
  border-radius: 25px;
  padding: 10px 20px;
  outline: none;
  &::placeholder {
    color: var(--text-2);
  }
`;

export const Button = styled.button`
  margin-left: 4px;
`;
