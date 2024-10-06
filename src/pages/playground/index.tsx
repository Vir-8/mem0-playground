import { useState, useEffect, useRef } from "react";
import "./index.css";
import axios from "axios";
import { Memories } from "@/components/Memories";
import { ChatList } from "@/components/ChatList";
import TypingAnimation from "@/components/TypingAnimation";
import { chatService } from "../../services/chatService";
import { Chat } from "@/components/ChatList";
import Link from "next/link";

export interface ChatMessage {
  type: "user" | "bot";
  message: string;
}

type ModelOption = {
  label: string;
  value: string;
};

export default function Playground() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [trigger, setTrigger] = useState(false);

  const options: ModelOption[] = [
    {
      label: "Google: gemini-1.5-flash",
      value: "gemini/gemini-1.5-flash",
    },
    {
      label: "Google: gemini-1.5-pro",
      value: "gemini/gemini-1.5-pro",
    },
  ];

  const [isModelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(options[0]);

  const dropdownRef = useRef<HTMLButtonElement>(null);
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

  // Create an empty chat on opening the page or clicking the create button.
  const createEmptyChat = () => {
    if (!isLoading) {
      const emptyChat: Chat = {
        id: Date.now(),
        title: "",
        messages: [{ type: "bot", message: dummyMessage }],
      };
      setCurrentChat(emptyChat);
      chatService.setCurrentChatId(emptyChat.id);
      chatService.updateChat({ type: "bot", message: dummyMessage });
      setChatLog(() => [{ type: "bot", message: dummyMessage }]);
    }
  };

  // Handle submitting input in the chat interface.
  const handleSubmit = () => {
    if (inputValue) {
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
    }
  };

  // Send a message to the backend and render LLM response in the chat.
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-response/`;
    const data = {
      userMessage: message,
      userId: userId,
      model: selectedModel.value,
    };
    axios.post(url, data).then((response) => {
      setIsLoading(false);
      chatService.updateChat({ type: "bot", message: response.data.response });
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "bot", message: response.data.response },
      ]);
      setTrigger((prev) => !prev);
    });
  };

  // On sending a message in an empty chat, save it as a new chat.
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
    const userId = chatService.getUserId();
    const loadedChats = chatService.getChats();
    setUserId(userId);
    setChats(loadedChats);
    createEmptyChat();

    document.addEventListener("click", (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setModelDropdownOpen(false);
      }
    });
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
        <div className="header-links flex flex-row">
          <a className="text-sm font-medium cursor-pointer px-4 py-2">
            Dashboard
          </a>
          <a className="text-sm font-medium cursor-pointer px-4 py-2">Users</a>
          <Link
            href="/playground"
            className="text-sm font-medium cursor-pointer px-4 py-2"
          >
            Playground
          </Link>
          <img
            className="mr-6"
            src="/images/settings.svg"
            alt="Settings Icon"
            width={20}
          />
          <img src="/images/user.svg" alt="User Icon" width={36} />
        </div>
      </div>
      <div className="body">
        <div>
          <div className="chat-container flex h-full">
            <ChatList
              chats={chats}
              onSelectChat={(chat) => selectChat(chat)}
              onNewChat={createEmptyChat}
              currentChatId={currentChat ? currentChat.id : null}
            />
            <div className="chat-and-memories-container">
              <div className="chat pt-2.5 relative flex flex-col w-full">
                <div className="z-1 sticky top-0 z-20 flex justify-end bg-background py-1 h-fit">
                  <div className="flex gap-4 pr-2 pl-2 items-center">
                    <button
                      className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 md:w-[300px] w-full justify-between text-ellipsis overflow-hidden"
                      role="combobox"
                      aria-expanded="false"
                      type="button"
                      aria-haspopup="dialog"
                      aria-controls="radix-:r10:"
                      data-state="closed"
                      onClick={() => setModelDropdownOpen(true)}
                      ref={dropdownRef}
                    >
                      {selectedModel.label}
                      <img src="/images/dropdown.svg" alt="Dropdown Icon" />
                    </button>
                  </div>
                </div>
                {isModelDropdownOpen && (
                  <div className="model-selection-dropdown absolute right-0 z-10 mt-11 mr-2 w-min shadow-md rounded-md bg-white">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 md:w-[300px] w-full text-ellipsis overflow-hidden"
                          role="option"
                          aria-disabled="false"
                          aria-selected="true"
                          data-disabled="false"
                          data-selected="true"
                          data-value="gpt-4o-mini"
                          onClick={() => setSelectedModel(option)}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`mr-2 h-4 w-4 ${option.value === selectedModel.value ? "opacity-100" : "opacity-0"}`}
                          >
                            <path
                              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="font-normal">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="chat-content h-full">
                  <div ref={chatAreaRef} className="flex flex-col pb-24">
                    {chatLog &&
                      chatLog.map((message, index) => (
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
                                  ? "/images/user.svg"
                                  : "/images/mem0.png"
                              }`}
                              alt="User Icon"
                            />
                          </div>
                          <div
                            className={`py-3 rounded-t-xl transition-none max-w-2xl block bg-card ${
                              message.type === "user"
                                ? "px-2 rounded-bl-xl"
                                : "bg-secondary px-5 rounded-br-xl"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: message.message,
                            }}
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
                      aria-disabled={isLoading}
                    >
                      <textarea
                        name="message"
                        placeholder="Type a message..."
                        className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full flex resize-none items-center overflow bg-background chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                      ></textarea>
                      <button
                        className="submit-val"
                        type="submit"
                        disabled={isLoading}
                      >
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
    </div>
  );
}
