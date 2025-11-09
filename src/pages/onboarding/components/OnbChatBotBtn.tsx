import { forwardRef } from "react";
import styled from "styled-components";

import AI from "@/assets/images/ai-frog.svg";

type OnbChatbotBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSheetOpen: boolean;
};

const OnbChatbotBtn = forwardRef<HTMLButtonElement, OnbChatbotBtnProps>(
  ({ isSheetOpen, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        $isSheetOpen={isSheetOpen}
        {...rest} // className, onClick, aria-* 등 모두 전달
      >
        <AIImg src={AI} alt="AI" />
      </Button>
    );
  },
);
OnbChatbotBtn.displayName = "OnbChatbotBtn";
export default OnbChatbotBtn;

const Button = styled.button<{ $isSheetOpen: boolean }>`
  position: fixed;
  top: 14vh;
  right: 15vw;
  z-index: 5;
  transition:
    top 0.3s ease,
    right 0.3s ease;
  @media (min-width: 414px) {
    right: 16vw;
  }
  @media (min-height: 700px) {
    top: calc(${props => (props.$isSheetOpen ? 11 : 14)}vh + env(safe-area-inset-bottom, 0px));
  }
`;

const AIImg = styled.img`
  width: 44px;
  height: 41px;
`;
