import styled from "styled-components";

const Title = styled.h2`
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: var(--fw-b);
  font-family: var(--ff-sans);
`;

export default Title;
