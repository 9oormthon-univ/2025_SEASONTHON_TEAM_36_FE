import styled from 'styled-components';

import Title from '../Title';

const HeaderStyle = styled.div`
  padding: 24px 0;
`;

const Header = () => {
  return (
    <HeaderStyle>
      <Title $fontSize={'var(--fs-2xl)'}>업무 추가하기</Title>
    </HeaderStyle>
  );
};

export default Header;
