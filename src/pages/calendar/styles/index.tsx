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
  @media (max-height: 667px) {
    font-size: 15px;
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
  padding: 4px 0;
  background: none;
  color: black;
  font-size: ${props => props.$fontSize};
  font-weight: 500;
  &:focus {
    outline: none;
  }
  @media (max-height: 667px) {
    font-size: var(--fs-sm);
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
`;
