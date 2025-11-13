import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30px;
  margin-top: clamp(36px, calc(36px + ((100vh - 667px) * 40 / 225)), 76px);
  margin-bottom: clamp(20px, calc(20px + ((100vh - 667px) * 16 / 225)), 36px);
  touch-action: pan-y pinch-zoom;
  overscroll-behavior-x: contain;
`;

export const Wrapper = styled.div`
  width: min(100%, 600px);
`;

export const Header = styled.header`
  width: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  align-items: center;
  gap: 8px;
  position: relative;
`;

export const HeaderTitle = styled.h2`
  width: fix-content;
  font-size: clamp(var(--fs-xs), 5vw, var(--fs-xl));
  font-weight: 700;
`;

export const Title = styled.h2<{ $fontSize?: string | number; $fontWeight?: number }>`
  font-size: ${props => props.$fontSize || "var(--fs-xl)"};
  font-weight: ${props => props.$fontWeight || 700};
  white-space: pre-line;
`;

export const SizedBox = styled.div`
  height: 40px;
`;

export const Text = styled.h3`
  margin-bottom: 20px;
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const DatePickerButton = styled.button`
  transform: rotateZ(90deg);
`;
