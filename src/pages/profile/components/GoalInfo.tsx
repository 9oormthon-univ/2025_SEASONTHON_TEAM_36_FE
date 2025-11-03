import { RespMonthlyTodos } from "@/common/types/response/statistics";

import { Title } from "../styles";
import { Date, Goal, GoalInfoStyle, RowOne, RowTwo, Success, Time } from "../styles/GoalInfo";

const GoalInfo = ({ data }: { data: RespMonthlyTodos[] }) => {
  return (
    <GoalInfoStyle>
      {data.map((value, index) => {
        return (
          <Goal key={index}>
            <RowOne>
              <Success />
              <Title $fontSize={"var(--fs-sm)"}>{value.title}</Title>
            </RowOne>
            <RowTwo>
              <Date>{`${value.startDate} ~ ${value.endDate}`}</Date>
              <Time>{value.totalDuration}</Time>
            </RowTwo>
          </Goal>
        );
      })}
    </GoalInfoStyle>
  );
};
export default GoalInfo;
