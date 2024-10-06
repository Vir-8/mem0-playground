import axios from "axios";
import { useState, useEffect } from "react";
import {MemoryItem} from "./MemoryItem";
import { chatService } from "@/services/chatService";

interface Memory {
  categories: string[],
  id: string,
  updated_at: string,
  memory: string
}

export const Memories: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [userId, setUserId] = useState<string>()

  const fetchMemories = () => {
    setIsLoading(true)
    const url = "http://localhost:8000/api/fetch-memories/";
    const data = {
      userId: userId
    };
    axios.post(url, data).then((response) => {
      console.log(response)
      setMemories(response.data.response.results)
      setIsLoading(false)
    });
  }

  const deleteAllMemories = () => {
    setIsLoading(true)
    const url = "http://localhost:8000/api/delete-memories/";
    const data = {
      userId: userId
    };
    axios.post(url, data).then(() => {
      fetchMemories();
    });
  }

  useEffect(() => {
    if (userId) {
      fetchMemories()
    }
  }, [trigger]);

  useEffect(() => {
    const userId = chatService.getUserId()
    setUserId(userId)
  }, [])

  return (
    <aside
      className={`memories pt-2.5 relative z-50 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 ${
        isCollapsed ? "w-[25px]" : "w-96"
      }`}
    >
      <div
        className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 -left-4 z-20"
      >
        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md w-8 h-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
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
            className={`lucide lucide-chevron-right h-4 w-4 transition-transform ease-in-out duration-500 ${
              isCollapsed ? "-rotate-180" : "rotate-0"
            }`}
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <>
          <div className="flex justify-between items-center w-full p-2">
            <div className="flex flex-1 items-center gap-2">
              <h2 className="text-med pr-2 font-semibold">Your Memories ({memories.length})</h2>
            </div>
            <div className="flex justify-end">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/30 hover:text-accent-foreground h-9 w-9"
                onClick={fetchMemories}
                disabled={isLoading}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/30 hover:text-accent-foreground h-9 w-9"
                onClick={deleteAllMemories}
                disabled={isLoading}
              >
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
                  className="lucide lucide-trash w-4 h-4"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div dir="ltr" className="relative overflow-hidden flex-grow px-2">
          {memories
            .slice()
            .reverse()
            .map(memory => (
            <MemoryItem key={memory.id} memory={memory.memory} categories={memory.categories} updated_at={memory.updated_at}/>
          ))}
          {memories.length === 0 &&
          <p className="mt-4 text-center">
            No memories found.
            Your memories will appear here.
          </p>
          }
          </div>
        </>
      )}
    </aside>
  );
};
