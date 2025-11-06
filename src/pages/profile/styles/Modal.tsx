import styled from "styled-components";

export const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  background: color-mix(in srgb, var(--bg-1, #000), transparent 40%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
`;

export const DatePicker = styled.div`
  width: 80%;
  max-width: 350px;
  height: fit-content;
  margin-top: clamp(70px, calc(70px + ((100vh - 667px) * 40 / 225)), 110px);
  background-color: white;
  border-radius: 20px;
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const YearNavigator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4%;
`;

export const Days = styled.div`
  display: grid;
  height: 105px;
  row-gap: 11px;
  column-gap: 14px;
  flex-shrink: 0;
  align-self: stretch;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

export const Day = styled.h3`
  text-align: center;
`;