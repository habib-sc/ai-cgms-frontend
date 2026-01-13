import type { PropsWithChildren } from "react";
import { Sidebar } from "../../components/dashboard/sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-[calc(100vh-56px)] bg-linear-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <Sidebar />
      <section className="mx-auto w-full max-w-6xl px-6 py-6">
        {children}
      </section>
    </main>
  );
}
