import React from "react";

import { ChatType } from "../types/Chat";

export const useChatForm = (
  userChat: string,
  setUserChat: React.Dispatch<React.SetStateAction<string>>,
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>,
) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userChat.trim()) return;
    const newUserChatInfo = {
      writer: "user" as const,
      content: userChat,
    };
    setChats(prev => [...prev, newUserChatInfo]);
    setUserChat("");
  };

  return { handleSubmit };
};
