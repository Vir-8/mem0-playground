import { useState } from "react";

export default function Memories() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`memories relative z-50 -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 ${
        isCollapsed ? "w-[25px]" : "w-96"
      }`}
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 -left-2 z-20"
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
            className={`lucide lucide-chevron-right h-4 w-4 transition-transform ease-in-out duration-500 rotate-0 ${isCollapsed ? '-rotate-180' : 'rotate-0'}`}
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <>
          <div className="flex justify-between items-center w-full p-2">
            <div className="flex flex-1 items-center gap-2">
              <h2 className="text-med pr-2 font-semibold">Your Memories (1)</h2>
            </div>
            <div className="flex justify-end">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/30 hover:text-accent-foreground h-9 w-9">
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
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/30 hover:text-accent-foreground h-9 w-9">
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
            <div
              data-radix-scroll-area-viewport=""
              className="h-full w-full rounded-[inherit]"
            >
              <div>
                <div
                  className="group flex flex-col justify-between items-start text-primary p-2 cursor-pointer hover:bg-accent/50 rounded-md mb-2"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="radix-:r8:"
                  data-state="closed"
                >
                  <div className="text-sm mb-2 line-clamp-2">Likes Mem0</div>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
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
                      className="lucide lucide-clock w-3 h-3 mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    28/09/2024, 18:27:04
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">
                      misc
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
