"use client";
import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm dark:bg-black dark:border-zinc-800 ${className}`}
    >
      {children}
    </div>
  );
}
