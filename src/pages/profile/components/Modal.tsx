import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { DatePicker, Day, Days, Overlay, YearNavigator } from "../styles/Modal";
import Button from "./Button";

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const Modal = ({
  open,
  date,
  setDate,
  setModalOpen,
}: {
  open: boolean;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const year = Number(date.split("-")[0]);
  const month = Number(date.split("-")[1]);
  // focus first button & esc handler, body scroll lock
  const [modalYear, setModalYear] = useState<number>(year);
  const navigate = useNavigate();

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
                setDate(`${modalYear}-${value}`);
                void navigate(
                  `/profile?yearMonth=${modalYear}-${value.toString().padStart(2, "0")}`,
                );
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

export default Modal;
