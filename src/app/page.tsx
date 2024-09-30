import Image from "next/image";

export default function Home() {
  return (
    <div className="main-page grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/images/light.svg"
          alt="Mem0.ai logo"
          width={180}
          height={38}
          priority
        />
        <ul className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Task to replicate the playground at{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              https://app.mem0.ai/playground
            </code>
            .
          </li>
        </ul>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/playground"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Playground
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://mem0.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Mem0
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center font-[family-name:var(--font-geist-sans)]">
        {" "}
        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
          - By Vir Kothari
        </code>
      </footer>
    </div>
  );
}
