import { useNavigate } from "react-router-dom";

import WellImg from "@/assets/images/well.png";

import { Button, Message, OutOfWell, Page, Wrapper } from "./styles/SignUp";

const SignUpDone = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <Wrapper>
        <OutOfWell src={WellImg as string} alt="우물" />
        <Message>{"회원가입이 완료되었습니다.\n우물 밖으로 나갈\n준비가 되셨나요?"}</Message>
      </Wrapper>
      <Button onClick={() => void navigate("/home")}>우물 밖으로 나가기</Button>
    </Page>
  );
};

export default SignUpDone;
