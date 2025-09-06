import styled from 'styled-components';

import Title from '../Title';

const InputStyle = styled.div`
  > :first-child {
    margin-bottom: 16px;
  }
`;

const Input = ({ title = '', fontSize = 'var(--fs-xl)', children }) => {
  return (
    <InputStyle>
      <Title $fontSize={fontSize}>{title}</Title>
      {children}
    </InputStyle>
  );
};

export default Input;
