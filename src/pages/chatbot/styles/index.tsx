import styled from "styled-components";

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
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

export const Title = styled.h2<{ $fontSize: number | string }>`
  width: 100%;
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: var(--fw-b);
  font-family: var(--ff-sans);
  @media (max-height: 667px), (max-width: 375px) {
    font-size: var(--fs-sm);
  }
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

export const Textarea = styled.textarea<{
  $fontSize?: number | string;
  $isModify?: boolean;
}>`
  width: 100%;
  border: none;
  border-bottom: ${props => (props.$isModify ? "1px solid black" : "none")};
  background: none;
  color: black;
  font-size: clamp(13px, 3.86vw, 16px);
  font-weight: 500;
  line-height: clamp(1.3, 1.4, 1.5);
  font-family: var(--ff-sans);
  resize: none;
  overflow: hidden;
  &:focus {
    outline: none;
  }
`;
