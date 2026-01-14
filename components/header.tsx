"use client";
// Global Header: standard navigation; auth state can be wired later via Zustand.

import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/stores/auth";
import { UserCircle, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, user, clear, fetchSession, isLoading, initialized } =
    useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!initialized) fetchSession();
  }, [initialized, fetchSession]);
  const isUserLoggedIn = isAuthenticated;
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-3 sm:px-6 backdrop-blur supports--webkit-backdrop-filter:bg-white/70 dark:bg-black/60 dark:border-zinc-800">
        <Link href="/" className="text-lg sm:text-xl font-semibold">
          AI Content Generator
        </Link>
        <nav className="hidden sm:flex items-center gap-4">
          <Link href="/dashboard" className="text-md hover:underline">
            Dashboard
          </Link>
          <Link href="/dashboard/content" className="text-md hover:underline">
            My Content
          </Link>
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          {isUserLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                aria-label="Profile"
                className="inline-flex items-center gap-2 text-md hover:underline"
              >
                <UserCircle className="h-5 w-5" />
                <span>{user?.name ?? "Profile"}</span>
              </Link>
              <button
                type="button"
                aria-label="Logout"
                onClick={() => {
                  clear();
                  router.replace("/login");
                }}
                className="inline-flex items-center gap-2 text-md text-red-600 hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
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
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center gap-2 sm:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {open && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-40 border-b border-zinc-200 bg-white/95 px-3 py-3 backdrop-blur dark:bg-black/80 dark:border-zinc-800">
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="text-sm hover:underline" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/dashboard/content" className="text-sm hover:underline" onClick={() => setOpen(false)}>
              My Content
            </Link>
            <div className="flex items-center gap-3">
              {isUserLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    aria-label="Profile"
                    className="inline-flex items-center gap-2 text-sm hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{user?.name ?? "Profile"}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label="Logout"
                    onClick={() => {
                      clear();
                      router.replace("/login");
                    }}
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {!isLoading && (
                    <>
                      <Link href="/login" className="text-sm hover:underline" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                      <Link href="/register" className="text-sm hover:underline" onClick={() => setOpen(false)}>
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" />
    </>
  );
}
