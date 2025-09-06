import styled from 'styled-components';

import GetOutButton from './components/GetOutButton';
import SignUpDoneMessage from './components/SignUpDoneMessage';
import Well from './components/Well';

const SignUpDoneStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 163px;
`;

const SignUpDone = () => {
  return (
    <SignUpDoneStyle>
      <Well />
      <SignUpDoneMessage>
        {'회원가입이 완료되었습니다.\n우물 밖으로 나갈\n준비가 되셨나요?'}
      </SignUpDoneMessage>
      <GetOutButton>우물 밖으로 나가기</GetOutButton>
    </SignUpDoneStyle>
  );
};

export default SignUpDone;
