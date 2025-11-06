import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import Button from "./Button";

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const Modal = ({
  open,
  year,
  month,
  setYear,
  setMonth,
  setModalOpen,
}: {
  open: boolean;
  year: number;
  month: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // focus first button & esc handler, body scroll lock
  const [modalYear, setModalYear] = useState<number>(year);

  const handleMoveYear = (offset: number) => {
    setModalYear(prev => prev + offset);
  };
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  // ensure modal root
  const getRoot = () => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    return root;
  };

  return createPortal(
    <Overlay>
      <DatePicker>
        <YearNavigator>
          <Button move="left" handleMoveYear={handleMoveYear} />
          <h3 className="typo-h3">{modalYear}년</h3>
          <Button move="right" handleMoveYear={handleMoveYear} />
        </YearNavigator>
        <Days>
          {months.map(value => (
            <Day
              key={value}
              className="typo-h3"
              onClick={() => {
                setYear(modalYear);
                setMonth(value);
                setModalOpen(prev => !prev);
              }}
              style={{
                color: modalYear === year && value === month ? "var(--green-500)" : "var(--text-2)",
              }}
            >
              {value}월
            </Day>
          ))}
        </Days>
      </DatePicker>
    </Overlay>,
    getRoot(),
  );
};

const Overlay = styled.div`
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

const DatePicker = styled.div`
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

const YearNavigator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4%;
`;

const Days = styled.div`
  display: grid;
  height: 105px;
  row-gap: 11px;
  column-gap: 14px;
  flex-shrink: 0;
  align-self: stretch;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

const Day = styled.h3`
  text-align: center;
`;

export default Modal;
