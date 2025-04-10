"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getChats } from "../api/gemini/chatService";
import { groupChatsByDate } from "../components/functions";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [groupedChats, setGroupedChats] = useState({});

  const fetchChats = async () => {
    try {
      const chats = await getChats();
      const filtered = chats.filter(chat => chat.messages.length > 0);
      const grouped = groupChatsByDate(filtered);
      setGroupedChats(grouped);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <ChatContext.Provider value={{ groupedChats, fetchChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
