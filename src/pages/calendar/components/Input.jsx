import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: ${props => (props.disabled ? 'none' : '1px solid black')};
  padding: 4px 0;
  background: none;
  color: black;
  font-size: ${props => props.$fontSize};
  font-weight: 500;
  &:focus {
    outline: none;
  }
`;

export default Input;
