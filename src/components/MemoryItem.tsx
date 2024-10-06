interface MemoryItemProps {
  memory: string;
  categories: string[];
  updated_at: string;
}

export const MemoryItem: React.FC<MemoryItemProps> = ({
  memory,
  categories,
  updated_at,
}) => {
  const formatDate = (dateString: string) => {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Get individual components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Format the date and time
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

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
          <div className="text-sm mb-2 line-clamp-2">{memory}</div>
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
            {formatDate(updated_at)}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories &&
              categories.map((category) => (
                <div
                  key={category}
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs"
                >
                  {category}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
