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
  currentChatId: Number | null;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  onNewChat,
  currentChatId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddNewChat = () => {
    onNewChat();
  };

  const handleSelectChat = (chat: Chat) => {
    console.log(`selecting ${chat.title}`);
    onSelectChat(chat);
  };

  return (
    <aside
      className={`chat-list-container relative z-50 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 ${
        isCollapsed ? "w-[50px]" : "w-[420px]"
      }`}
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="invisible lg:visible absolute top-1/2 transform -translate-y-1/2 -right-3 z-20"
      >
        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md w-8 h-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-chevron-left h-4 w-4 transition-transform ease-in-out duration-500 rotate-0 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
      </div>
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
                  <ChatListItem title={chat.title} date="Sep 30, 2024" />
                </div>
              ))}
          </li>
          <li className="absolute bottom-0 p-2 w-full grow flex items-end">
            <button
              onClick={handleAddNewChat}
              className={`inline-flex cursor-pointer items-center whitespace-nowrap rounded-md text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground w-full justify-center h-10 ${
                !isCollapsed ? "py-2 px-4" : ""
              }`}
            >
              <span className={`${!isCollapsed ? "mr-4" : ""}`}>
                <img src="/images/pen.svg" alt="Pen Icon" />
              </span>
              {!isCollapsed && (
                <p className="whitespace-nowrap opacity-100">New Chat</p>
              )}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
