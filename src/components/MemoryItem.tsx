interface MemoryItemProps {
  id: string
}

export const MemoryItem: React.FC<MemoryItemProps> = ({
  id
}) => {

  return (
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
          <div className="text-sm mb-2 line-clamp-2">{id}</div>
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
  );
}
