import leftImg from "@/assets/images/left-arrow.png";
import rightImg from "@/assets/images/right-arrow.png";

const Button = ({
  move,
  handleMoveMonth,
}: {
  move: "left" | "right";
  handleMoveMonth: (offset: number) => void;
}) => {
  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleMoveMonth(move === "left" ? -1 : 1);
      }}
      src={move === "left" ? (leftImg as string) : (rightImg as string)}
      alt={move === "left" ? "왼쪽" : "오른쪽"}
      width="23"
      height="23"
    />
  );
};

export default Button;
