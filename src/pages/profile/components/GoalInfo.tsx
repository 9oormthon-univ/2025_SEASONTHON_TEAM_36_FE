import { Title } from "../styles";
import { Date, Goal, GoalInfoStyle, RowOne, RowTwo, Success, Time } from "../styles/GoalInfo";

export interface GoalInfoType {
  title: string;
  startDate: string;
  endDate: string;
  time: string;
}

const GoalInfo = ({ data }: { data: GoalInfoType[] }) => {
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
              <Time>{value.time}</Time>
            </RowTwo>
          </Goal>
        );
      })}
    </GoalInfoStyle>
  );
};
export default GoalInfo;
