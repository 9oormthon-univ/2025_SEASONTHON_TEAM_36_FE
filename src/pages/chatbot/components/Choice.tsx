import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface ChoiceProps {
  setSplashOpen: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<boolean>>;
  buttonTexts: string[];
}

const Choice = ({ setSplashOpen, setStatus, buttonTexts }: ChoiceProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: "25px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "var(--green-500)",
          }}
        />

        <span
          style={{
            whiteSpace: "nowrap",
            color: "#333",
            fontSize: "var(--fs-xs)",
            fontWeight: 500,
          }}
        >
          아래의 버튼을 눌러서 계획을 확정하자!
        </span>

        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "var(--green-500)",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {buttonTexts.map((value, index) => (
              <button
                key={index}
                style={{
                  borderRadius: "16px",
                  background: "var(--natural-200)",
                  padding: "10px 15px",
                }}
                onClick={() => {
                  if (index == 0) {
                    setSplashOpen(true);
                    setTimeout(() => {
                      void navigate("/chatbot/result");
                    }, 3000);
                  } else {
                    setStatus(false);
                  }
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choice;
