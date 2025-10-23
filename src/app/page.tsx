import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-[6rem]">
          My <span className="text-indigo-500">Blogging</span> Platform
        </h1>
        <p className="max-w-2xl text-lg text-gray-300">
          Welcome to a full-stack blogging application built with the latest
          technologies. Create, manage, and share your thoughts with the world.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/blog"
            className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            View Blog Posts
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

