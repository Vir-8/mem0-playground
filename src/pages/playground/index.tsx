import { useState, useEffect, useRef } from "react";
import "./index.css";
import axios from "axios";
import {Memories} from "@/components/Memories";
import { ChatList } from "@/components/ChatList";
import TypingAnimation from "@/components/TypingAnimation";
import { chatService } from "../../services/chatService";
import { Chat } from "@/components/ChatList";
import Link from "next/link";

export interface ChatMessage {
  type: "user" | "bot";
  message: string;
}

export default function Playground() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [trigger, setTrigger] = useState(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);

  const dummyMessage = `<p>👋 Hi there! I'm mem0.ai, your personal assistant. How can I help you today? 😊</p> <br />
    <p>Here are a few things you can ask me:</p>
    <ul>
      <li>- 📝 Remember my name is Mem0.</li>
      <li>- 🌇 I live in San Francisco.</li>
      <li>- ❓ What is my name?</li>
      <li>- 🏡 Where do I live?</li>
      <li>- 🤔 What do you remember about me?</li>
    </ul> <br />

    <p>Go ahead, ask me anything! Let's make your experience extraordinary. 🌟</p>
  `;

  const createEmptyChat = () => {
    const emptyChat: Chat = {
      id: Date.now(),
      title: "",
      messages: [{ type: "bot", message: dummyMessage }],
    };
    setCurrentChat(emptyChat);
    chatService.setCurrentChatId(emptyChat.id);
    chatService.updateChat({ type: "bot", message: dummyMessage });
    setChatLog(() => [{ type: "bot", message: dummyMessage }]);
  };

  const handleSubmit = () => {
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);
    if (!currentChat || !currentChat.title) {
      handleNewChat(inputValue);
    } else if (currentChat) {
      chatService.updateChat({ type: "user", message: inputValue });
    }
    sendMessage(inputValue);
    setInputValue("");
  };

  // Send a message to the backend and render LLM response in the chat.
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const url = "http://localhost:8000/api/generate-response/";
    const data = {
      userMessage: message,
      userId: 'new_user'
    };
    axios.post(url, data).then((response) => {
      setIsLoading(false);
      chatService.updateChat({ type: "bot", message: response.data.response });
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "bot", message: response.data.response },
      ]);
      setTrigger(prev => !prev);
    });
  };

  // On sending a message in an empty chat, store it as a new chat.
  const handleNewChat = (title: string) => {
    const newChat = chatService.createNewChat(title, currentChat?.id || null);
    chatService.setCurrentChatId(newChat.id);
    setCurrentChat(() => newChat);
    setChats([...chats, newChat]);
    chatService.updateChat({ type: "user", message: inputValue });
  };

  // Select a chat from the list of chats.
  const selectChat = (selectedChat: Chat) => {
    setCurrentChat(selectedChat);
    chatService.setCurrentChatId(selectedChat.id);
  };

  // Update the chat log on switching current chat.
  useEffect(() => {
    if (currentChat && currentChat.title) {
      setChatLog(chatService.getMessages(currentChat.id));
    }
  }, [currentChat]);

  // Scroll to the bottom of the chat by default.
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatLog]);

  // Load existing chats on initialization.
  useEffect(() => {
    const loadedChats = chatService.getChats();
    setChats(loadedChats);
    createEmptyChat();
  }, []);

  return (
    <div className="playground-container">
      <div className="header px-4 flex justify-between items-center">
        <a
          href="/"
          className="text-xl md:text-2xl font-bold text-popover-foreground"
        >
          <img
            src="/images/light.svg"
            alt="Mem0 Icon"
            width={120}
            height={40}
          />
        </a>
      </div>
      <div className="body">
        <div className="sidebar w-[180px]">
          <a className="text-sm font-medium cursor-pointer px-4 py-2">
            Dashboard
          </a>
          <a className="text-sm font-medium cursor-pointer px-4 py-2">Users</a>
          <Link
            href="/playground"
            className="text-sm font-medium cursor-pointer text-primary bg-indigo-100 px-4 py-2"
          >
            Playground
          </Link>
        </div>
        <div>
          <div className="chat-container flex pt-2.5 h-full">
            <ChatList
              chats={chats}
              onSelectChat={(chat) => selectChat(chat)}
              onNewChat={createEmptyChat}
              currentChatId={currentChat ? currentChat.id : null}
            />
            <div className="chat relative flex flex-col w-full">
              <div className="z-1 sticky top-0 z-20 flex justify-end bg-background py-1 h-fit">
                <div className="flex gap-4 pr-2 pl-2 items-center">
                  <div className="relative w-50">
                    <input
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8"
                      placeholder="User Id"
                      type="text"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                  <button
                    className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 md:w-[300px] w-full justify-between text-ellipsis overflow-hidden"
                    role="combobox"
                    aria-expanded="false"
                    type="button"
                    aria-haspopup="dialog"
                    aria-controls="radix-:r10:"
                    data-state="closed"
                  >
                    Google: gemini-1.5-flash
                    <img src="/images/dropdown.svg" alt="Dropdown Icon" />
                  </button>
                </div>
              </div>

              <div className="chat-content h-full">
                <div ref={chatAreaRef} className="flex flex-col pb-24">
                  {chatLog.map((message, index) => (
                    <div
                      key={index}
                      className={`flex p-4 gap-3 justify-start ${
                        message.type === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div className="relative shrink-0 overflow-hidden rounded-full flex self-center w-7 h-7">
                        <img
                          src={`${
                            message.type === "user"
                              ? "/images/user.jpg"
                              : "/images/mem0.png"
                          }`}
                          alt="Mem0 Icon"
                        />
                      </div>
                      <div
                        className={`py-3 rounded-t-xl transition-none max-w-2xl block bg-card ${
                          message.type === "user"
                            ? "px-2 rounded-bl-xl"
                            : "bg-secondary px-5 rounded-br-xl"
                        }`}
                        dangerouslySetInnerHTML={{ __html: message.message }}
                      ></div>
                    </div>
                  ))}
                  {isLoading && (
                    <div
                      key={chatLog.length}
                      className="flex p-4 gap-3 justify-start"
                    >
                      <div className="relative shrink-0 overflow-hidden rounded-full flex self-center w-7 h-7">
                        <img src="/images/mem0.png" alt="Mem0 Icon" />
                      </div>
                      <div className="py-3 rounded-t-xl transition-none max-w-2xl block bg-card bg-secondary px-5 rounded-br-xl">
                        <TypingAnimation />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 w-full chat-bar-container bg-background">
                <div className="pt-0 px-2 pb-2">
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="flex justify-between w-full gap-2 chat-bar"
                  >
                    <textarea
                      name="message"
                      placeholder="Type a message..."
                      className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full flex resize-none items-center overflow bg-background chat-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    ></textarea>
                    <button className="submit-val" type="submit">
                      <img src="/images/submit.svg" alt="Submit Button" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <Memories trigger={trigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
