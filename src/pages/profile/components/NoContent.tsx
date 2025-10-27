import sadFrog from "@/assets/images/frog-face-1.svg";

import { Title } from "../styles";
import { GoalInfoStyle } from "../styles/GoalInfo";

const NoContent = ({ title }: { title: string }) => {
  return (
    <GoalInfoStyle>
      <div style={{ width: "100%" }}>
        <img src={sadFrog} alt="슬픈개구리" width="60" />
      </div>
      <Title>
        <span style={{ color: "var(--green-400)" }}>{title}</span>
        {`\n과제 기록이 없습니다`}
      </Title>
    </GoalInfoStyle>
  );
};

export default NoContent;
