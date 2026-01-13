"use client";
// Global Header: standard navigation; auth state can be wired later via Zustand.

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "../lib/stores/auth";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, user, clear, fetchSession, isLoading } =
    useAuthStore();
  const router = useRouter();
  useEffect(() => {
    const tokenPresent =
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken");
    if (tokenPresent && !isAuthenticated && !isLoading) fetchSession();
  }, [isAuthenticated, isLoading, fetchSession]);
  const isUserLoggedIn = isAuthenticated;
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur supports--webkit-backdrop-filter:bg-white/70 dark:bg-black/60 dark:border-zinc-800">
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
              onClick={() => {
                clear();
                router.replace("/login");
              }}
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
