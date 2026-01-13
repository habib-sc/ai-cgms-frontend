import type { PropsWithChildren } from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { RequireAuth } from "../../components/auth/require-auth";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <RequireAuth>
      <main className="flex min-h-[calc(100vh-56px)] bg-linear-to-b from-violet-50 to-white dark:from-black dark:to-zinc-900">
        <Sidebar />
        <section className="mx-auto w-full max-w-6xl px-6 py-6">
          {children}
        </section>
      </main>
    </RequireAuth>
  );
}
