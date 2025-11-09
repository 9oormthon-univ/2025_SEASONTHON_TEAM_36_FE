import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 0 clamp(14px, 3.86vw, 16px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.66vw, 11px);
  height: clamp(180px, 32vh, 313px);
  margin: clamp(16px, 6.28vw, 26px) 0;
  padding: clamp(4px, 1.21vw, 5px);
  overflow: scroll;
  flex-shrink: 0;
`;

export const GreenButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: clamp(6px, 2.17vw, 9px) 0;

  button {
    height: clamp(42px, 11.35vw, 47px);
    min-width: clamp(135px, 36.71vw, 152px);
    font-size: clamp(14px, 4.11vw, 17px);
    padding: clamp(9px, 2.66vw, 11px) clamp(8px, 2.42vw, 10px);
  }
`;

export const Page = styled.main`
  padding: 0px clamp(13px, 3.62vw, 15px);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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

export const TodoTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: clamp(8px, 2.42vw, 10px);
`;

export const Modify = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: clamp(3px, 0.97vw, 4px);

  img {
    width: clamp(14px, 3.86vw, 16px);
    height: clamp(14px, 3.86vw, 16px);
  }
`;

export const TitleInput = styled.input<{ $disabled: boolean }>`
  border: none;
  border-bottom: ${props => (props.$disabled ? "none" : "1px solid black")};
  background: none;
  color: black;
  font-size: clamp(var(--fs-xl), 5.31vw, var(--fs-2xl));
  font-weight: 700;
  width: auto;
  min-width: clamp(200px, 57.97vw, 240px);
  max-width: calc(100vw - clamp(70px, 19.32vw, 80px));
  &:focus {
    outline: none;
  }
  cursor: ${props => (props.$disabled ? "default" : "text")};
`;

export const MeasureText = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  font-size: clamp(var(--fs-xl), 5.31vw, var(--fs-2xl));
  font-weight: 700;
`;

export const TodoDate = styled.span`
  display: block;
  color: var(--text-2);
  font-size: clamp(15px, 4.35vw, 18px);
  font-weight: 500;
  line-height: var(--lh-l);
`;

export const Day = styled.div<{ $checked: boolean }>`
  border-radius: 100%;
  padding: clamp(4px, 1.21vw, 5px) clamp(6px, 1.93vw, 8px);
  background-color: ${props => (props.$checked ? "var(--green-500)" : "var(--natural-200)")};
  color: ${props => (props.$checked ? "white" : "black")};
  font-size: clamp(11px, 3.14vw, 13px);
  transition:
    background-color 0.1s linear,
    color 0.1s linear;
`;

export const Days = styled.div`
  display: flex;
  justify-content: space-between;
  margin: clamp(10px, 3.14vw, 13px) 0;
  gap: clamp(2px, 0.72vw, 3px);
`;

export const TitleWrapper = styled.div`
  margin-top: clamp(6px, 2.17vw, 9px);

  h2 {
    font-size: clamp(14px, 4.11vw, 17px) !important;
  }
`;

export const SubjectTypes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(12px, 4.11vw, 17px) clamp(14px, 4.35vw, 18px);
  margin-top: clamp(12px, 3.62vw, 15px);
`;

export const SubjectType = styled.button<{ $checked: boolean }>`
  padding: clamp(10px, 3.14vw, 13px) clamp(3.5px, 1.12vw, 4.63px);
  border-radius: clamp(16px, 4.83vw, 20px);
  background-color: ${props => (props.$checked ? "var(--green-500)" : "var(--natural-200)")};
  color: ${props => (props.$checked ? "white" : "black")};
  font-size: clamp(13px, 3.62vw, 15px);
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border: none;
  transition:
    0.2s background-color ease-in-out,
    0.2s color ease-in-out;
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
