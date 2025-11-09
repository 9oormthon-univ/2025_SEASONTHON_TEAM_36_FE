import { useDate } from "@/common/hooks/useDate";

import Constellation from "./components/Constellation";
import DateNavigation from "./components/DateNavigation";
import { Header, Message, Page, Title } from "./styles";

export default function Diary() {
  const { date, handleMoveMonth } = useDate("diary");
  return (
    <Page>
      <Header>
        <Title>일기</Title>
      </Header>
      <DateNavigation handleMoveMonth={handleMoveMonth} date={new Date(date)} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Constellation date={new Date(date)} />
      </div>
      <Message>{"개구리가 우물 안에서 볼 밤하늘을 밝혀주세요"}</Message>
    </Page>
  );
}
