import styled from "styled-components";

export const ChatBody = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
  overflow-y: auto;
`;

export const ChatDate = styled.span`
  text-align: center;
  font-size: 12px;
`;

export const ChatbotRow = styled.div`
  display: flex;
`;

export const ChatbotChat = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  word-break: break-word;
  font-size: var(--fs-lg);
  gap: 3px;
`;

export const ChatbotChatBlock = styled.div`
  padding: 10px 15px;
  white-space: pre-wrap;
`;

export const ProfileImg = styled.img`
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

export const UserRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const UserChat = styled.div`
  padding: 10px 15px;
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
