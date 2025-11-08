import ChatbotImg from "@/assets/images/ai-frog.svg";

import { ChatbotChat, ChatbotRow, ProfileImg, UserChat, UserRow } from "../styles/Chat";

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
