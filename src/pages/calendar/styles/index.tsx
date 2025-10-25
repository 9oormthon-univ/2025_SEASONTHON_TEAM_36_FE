import styled from "styled-components";

export const Page = styled.div`
  height: 100vh;
  position: relative;
`;

export const Main = styled.div`
  height: 100%;
  overflow: auto;
  position: relative;
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

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export const Input = styled.input<{ disabled: boolean; $fontSize: number | string }>`
  width: 100%;
  border: none;
  border-bottom: ${props => (props.disabled ? "none" : "1px solid black")};
  padding: 4px 10.5px 4px 13px;
  background: none;
  color: black;
  font-size: ${props => props.$fontSize};
  font-weight: 500;
  &:focus {
    outline: none;
  }
  @media (max-height: 667px), (max-width: 375px) {
    font-size: var(--fs-sm);
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 12px 8px;
  border: none;

  letter-spacing: -0.25px;
  font-size: var(--fs-lg);

  &:focus {
    outline: none;
  }

  &::placeholder {
    padding: 0 8px;
    color: var(--text-2);
    font-size: var(--fs-md);
  }

  @media (max-width: 375px) {
    font-size: var(--fs-md);

    &::placeholder {
      font-size: var(--fs-sm);
    }
  }
`;

export const Textarea = styled.textarea<{
  $fontSize: number | string;
}>`
  width: 100%;
  border: none;
  padding: 8px;
  background: none;
  color: black;
  font-size: ${props => props.$fontSize};
  font-family: var(--ff-sans);
  resize: none;
  &:focus {
    outline: none;
  }
  @media (max-height: 667px), (max-width: 375px) {
    font-size: var(--fs-sm);
    padding-left: 8px;
    padding-right: 8px;
  }
`;
