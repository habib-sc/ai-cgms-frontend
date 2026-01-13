"use client";
// Global Header: standard navigation; auth state can be wired later via Zustand.

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:bg-black dark:border-zinc-800">
      {/* Brand */}
      <Link href="/" className="text-lg font-semibold">AI Content</Link>

      {/* Primary navigation */}
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
        <Link href="/content" className="text-sm hover:underline">My Content</Link>
      </nav>

      {/* Auth actions (placeholder) */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm hover:underline">Login</Link>
        <Link href="/register" className="text-sm hover:underline">Register</Link>
      </div>
    </header>
  );
}

