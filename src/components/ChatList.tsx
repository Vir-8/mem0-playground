import ChatListItem from "./ChatListItem";
import { ChatMessage } from "@/pages/playground";
import React from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddNewChat = () => {
    onNewChat();
  };

  const handleSelectChat = (chat: Chat) => {
    onSelectChat(chat);
  };

  // Convert timestamps to format of "Oct 27, 2024, 10:25:38 AM"
  const getFormattedDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${meridiem}`;
  };

  let lastCategory = "";

  // In order to categorize the chat list based on creation dates of chats.
  const getDateCategory = (timestamp: number): string => {
    const date = new Date(timestamp);
    const currentDate = new Date(Date.now());

    const dayOfMonth = date.getDate();
    const currentDayOfMonth = currentDate.getDate();

    if (currentDayOfMonth === dayOfMonth) {
      return "Today";
    } else if (currentDayOfMonth === dayOfMonth + 1) {
      return "Yesterday";
    } else if (
      currentDayOfMonth > dayOfMonth + 1 &&
      currentDayOfMonth <= dayOfMonth + 7
    ) {
      return "Last Week";
    } else {
      return "Older";
    }
  };

  return (
    <aside
      className={`chat-list-container pt-2.5 relative z-50 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 ${
        isCollapsed ? "w-[25px] min-w-fit" : "w-[360px]"
      }`}
    >
      <div className="chat-list">
        <ul>
          <li
            className={`sticky p-2 px-4 w-full grow flex items-end ${
              !isCollapsed ? "justify-between" : "flex-col gap-1"
            }`}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`new-chat-button w-fit inline-flex cursor-pointer items-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-center h-10 py-2 px-2`}
            >
              <span>
                <img src="/images/sidebar.svg" alt="Sidebar Icon" />
              </span>
            </button>
            <button
              onClick={handleAddNewChat}
              className={`new-chat-button w-fit inline-flex cursor-pointer items-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-center h-10 py-2 px-2`}
            >
              <span>
                <img src="/images/pen.svg" alt="Pen Icon" />
              </span>
            </button>
          </li>
          {!isCollapsed && (
            <li className="w-full pt-2 items-start chat-list-items-container">
              {chats.length === 0 && (
                <p className="pt-4 text-center text-balance">
                  No chats found! Type a message to start one.
                </p>
              )}
              {chats &&
                chats
                  .slice()
                  .reverse()
                  .map((chat: Chat) => {
                    const currentCategory = getDateCategory(chat.id);
                    const showHeader = currentCategory !== lastCategory;
                    lastCategory = currentCategory;

                    return (
                      <React.Fragment key={`${currentCategory}-${chat.id}`}>
                        {showHeader && (
                          <p
                            key={currentCategory}
                            className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate"
                          >
                            {currentCategory}
                          </p>
                        )}
                        <div
                          key={chat.id}
                          onClick={() => handleSelectChat(chat)}
                          className={`${
                            currentChatId && currentChatId === chat.id
                              ? "bg-secondary"
                              : ""
                          }`}
                        >
                          <ChatListItem
                            title={chat.title}
                            date={getFormattedDate(chat.id)}
                            id={chat.id}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
