import styled from "styled-components";

import ChatbotImg from "@/assets/images/ai-frog.svg";

const ChatbotRow = styled.div`
  display: flex;
`;

const ChatbotChat = styled.div`
  border-radius: 16px 0 16px 16px;
  padding: 10px 15px;
  max-width: 240px;
  height: auto;
  word-break: break-word;
  font-size: var(--fs-sm);
  @media (min-width: 414px) {
    max-width: 280px;
    font-size: var(--fs-md);
  }
`;

const ProfileImg = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  // padding: 5px;
  background: var(--bg-1-soft);
  width: 48px;
  height: 48px;
  @media (min-width: 414px) {
    width: 52px;
    height: 52px;
  }
`;

const UserRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const UserChat = styled.div`
  padding: 10px 15px;
  border: 1px solid var(--green-500);
  background: var(--green-100);
  border-radius: 16px 0 16px 16px;
  max-width: 240px;
  font-size: var(--fs-sm);
  word-break: break-word;
  @media (min-width: 414px) {
    max-width: 280px;
    font-size: var(--fs-md);
  }
`;

export const Chatbot = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChatbotRow>
      <ProfileImg src={ChatbotImg} alt="챗봇 프로필" />
      <ChatbotChat>{children}</ChatbotChat>
    </ChatbotRow>
  );
};

export const User = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserRow>
      <UserChat>{children}</UserChat>
    </UserRow>
  );
};
