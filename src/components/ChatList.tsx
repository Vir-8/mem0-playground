import ChatListItem from "./ChatListItem";
import { ChatMessage } from "@/pages/playground";
import { useState } from "react";

export interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
}

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  currentChatId: number | null;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  onNewChat,
  currentChatId,
}) => {
  const handleAddNewChat = () => {
    onNewChat();
  };

  const handleSelectChat = (chat: Chat) => {
    onSelectChat(chat);
  };

  return (
    <aside
      className={`chat-list-container pt-2.5 relative z-50 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 w-[420px]`}
    >
      <div className="chat-list">
        <ul>
          <li className="w-full pt-5 items-start">
            <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
              Today
            </p>
            {chats
              .slice()
              .reverse()
              .map((chat: Chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`${
                    currentChatId && currentChatId === chat.id
                      ? "bg-secondary"
                      : ""
                  }`}
                >
                  <ChatListItem title={chat.title} date="Sep 30, 2024" id={chat.id} />
                </div>
              ))}
          </li>
          <li className="absolute bottom-0 p-2 px-4 w-full grow flex items-end">
            <button
              onClick={handleAddNewChat}
              className={`new-chat-button inline-flex cursor-pointer items-center whitespace-nowrap rounded-md text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground w-full justify-center h-10 py-2 px-4`}
            >
              <span className={`mr-4`}>
                <img src="/images/pen.svg" alt="Pen Icon" />
              </span>
              <p className="whitespace-nowrap opacity-100">New Chat</p>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
