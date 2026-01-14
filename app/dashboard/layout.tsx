"use client";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { RequireAuth } from "../../components/auth/require-auth";
import { Button } from "../../components/ui/button";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <RequireAuth>
      <main className="flex min-h-[calc(100vh-56px)] bg-linear-to-b from-violet-50 to-white dark:from-black dark:to-zinc-900">
        <Sidebar className="hidden sm:flex" />
        <section className="mx-auto w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6">
          <div className="mb-3 flex items-center justify-between sm:hidden">
            <Button
              variant="secondary"
              size="sm"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>{open ? "Close" : "Menu"}</span>
            </Button>
          </div>
          {children}
        </section>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 sm:hidden"
              onClick={() => setOpen(false)}
            />
            <Sidebar
              variant="mobile"
              className="sm:hidden"
              onNavigate={() => setOpen(false)}
            />
          </>
        )}
      </main>
    </RequireAuth>
  );
}
