import { Link } from "react-router-dom";

import WellImg from "@/assets/images/well.png";

import { Button, Message, Page } from "./styles/SignUp";

const SignUpDone = () => {
  return (
    <Page>
      <img src={WellImg} alt="우물" width="208" />
      <Message>{"회원가입이 완료되었습니다.\n우물 밖으로 나갈\n준비가 되셨나요?"}</Message>
      <Button>
        <Link to="/home">우물 밖으로 나가기</Link>
      </Button>
    </Page>
  );
};

export default SignUpDone;
