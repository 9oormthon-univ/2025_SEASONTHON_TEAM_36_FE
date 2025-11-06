import leftImg from "@/assets/images/left-arrow.png";
import rightImg from "@/assets/images/right-arrow.png";

const Button = ({
  move,
  handleMoveYear,
}: {
  move: "left" | "right";
  handleMoveYear: (offset: number) => void;
}) => {
  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleMoveYear(move === "left" ? -1 : 1);
      }}
      src={move === "left" ? (leftImg as string) : (rightImg as string)}
      alt={move === "left" ? "왼쪽" : "오른쪽"}
      width="21"
      height="21"
    />
  );
};

export default Button;
