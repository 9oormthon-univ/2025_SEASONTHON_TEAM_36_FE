import styled from 'styled-components';

const TextInput = styled.input`
  width: 100%;
  padding: 12px 8px;
  border: none;

  letter-spacing: -0.25px;
  font-size: var(--fs-lg);

  &:focus {
    outline: none;
  }

  &::placeholder {
    padding: 0 8px;
    color: var(--text-2);
    font-size: var(--fs-md);
  }
`;

export default TextInput;
