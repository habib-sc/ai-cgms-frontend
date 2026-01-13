"use client";
// Global Header: standard navigation; auth state can be wired later via Zustand.

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "../lib/stores/auth";
import { UserCircle, LogOut } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user, clear, fetchSession, isLoading } =
    useAuthStore();
  useEffect(() => {
    const tokenPresent =
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken");
    if (tokenPresent && !isAuthenticated && !isLoading) fetchSession();
  }, [isAuthenticated, isLoading, fetchSession]);
  const isUserLoggedIn =
    isAuthenticated ||
    (typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken"));
  return (
    <header className="flex w-full items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:bg-black dark:border-zinc-800">
      <Link href="/" className="text-lg font-semibold">
        AI Content
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm hover:underline">
          Dashboard
        </Link>
        <Link href="/dashboard/content" className="text-sm hover:underline">
          My Content
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        {isUserLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              aria-label="Profile"
              className="inline-flex items-center gap-2 text-sm hover:underline"
            >
              <UserCircle className="h-5 w-5" />
              <span className="hidden sm:inline">
                {user?.name ?? "Profile"}
              </span>
            </Link>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            {!isLoading && (
              <>
                <Link href="/login" className="text-sm hover:underline">
                  Login
                </Link>
                <Link href="/register" className="text-sm hover:underline">
                  Register
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
