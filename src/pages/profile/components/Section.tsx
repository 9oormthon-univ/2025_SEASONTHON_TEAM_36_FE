import styled from "styled-components";

import { Text } from "../styles";

const Align = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <section>
      <Text className="typo-h4">{title}</Text>
      <Align>{children}</Align>
    </section>
  );
};

export default Section;
