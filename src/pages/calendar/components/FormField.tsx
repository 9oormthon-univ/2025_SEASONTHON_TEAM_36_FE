import { Title } from "../styles";
import { FormFieldStyle } from "../styles/Form";
import { FormFieldProps } from "../types/props";

/**
 * 폼 필드를 감싸는 컴포넌트로, 제목과 입력 요소를 포함합니다.
 */
const FormField = ({ title = "", fontSize = "var(--fs-xl)", children }: FormFieldProps) => {
  return (
    <FormFieldStyle>
      <Title $fontSize={fontSize}>{title}</Title>
      {children}
    </FormFieldStyle>
  );
};

export default FormField;
