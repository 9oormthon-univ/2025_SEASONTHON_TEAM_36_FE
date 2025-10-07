import styled from "styled-components";

export const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 35px;
  margin-top: 14px;
  margin-bottom: 55px;
  padding: 0 30px;
`;

export const Header = styled.div`
  padding: 24px 0;
`;

export const GoalContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  resize: vertical;
  padding: 12px;

  border-radius: 4px;
  border: 0.5px solid var(--natural-400);
  background: var(--bg-1);
  resize: none;

  &::placeholder {
    color: var(--natural-800, #6f737b);
  }

  &:focus {
    outline: none;
  }
`;

export const LetterCount = styled.div`
  display: flex;
  position: absolute;
  bottom: 24px;
  right: 15px;
`;

export const Count = styled.span`
  color: var(--text-3);
  font-size: var(--fs-lg);
`;

export const BottomLineContainer = styled.div`
  border-bottom: 1px solid var(--natural-400);
`;

export const Submit = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export const Toggle = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
`;

export const CheckBox = styled.div<{ $toggle: boolean }>`
  width: 23px;
  height: 23px;
  border: ${props => (props.$toggle ? "none" : "1px solid var(--natural-400)")};
  border-radius: 4px;
  background-color: ${props => (props.$toggle ? "var(--green-500)" : "#ffffff")};
  transition:
    background-color 0.1s linear,
    border 0.1s linear;
`;

export const EveryDay = styled.span`
  display: block;
  margin: 0 8px;
  font-size: var(--fs-xl);
`;

/**
 * WeekButtons.tsx 컴포넌트 스타일
 */
export const Day = styled.div<{ $checked: boolean }>`
  border-radius: 100%;
  padding: 5px 8.5px;
  background-color: ${props => (props.$checked ? "var(--green-500)" : "var(--natural-200)")};
  color: ${props => (props.$checked ? "white" : "black")};
  font-size: var(--fs-sm);
  transition:
    background-color 0.1s linear,
    color 0.1s linear;
`;

export const Days = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px 6.39px 10px;
`;

/**
 * FormField.tsx 컴포넌트 스타일
 */
export const FormFieldStyle = styled.div`
  position: relative;
  > :first-child {
    margin-bottom: 16px;
  }
`;
