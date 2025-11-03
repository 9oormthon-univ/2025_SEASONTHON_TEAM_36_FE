import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";

const Button = styled.button<{ $isSheetOpen: boolean }>`
  position: fixed;
  top: 12px;
  right: 26px;
  transition:
    top 0.3s ease,
    right 0.3s ease;
  @media (min-width: 414px) {
    right: 26px;
  }
  @media (min-height: 700px) {
    top: calc(${props => (props.$isSheetOpen ? 12 : 48)}px + env(safe-area-inset-bottom, 0px));
  }
`;

const AIImg = styled.img`
  width: 58px;
  height: 58px;
`;

const ChatbotBtn = ({ isSheetOpen }: { isSheetOpen: boolean }) => {
  const navigate = useNavigate();
  return (
    <Button
      $isSheetOpen={isSheetOpen}
      onClick={() => {
        void navigate("/chatbot");
      }}
    >
      <AIImg src={AI} alt="AI" />
    </Button>
  );
};

export default ChatbotBtn;
