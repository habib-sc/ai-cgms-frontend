"use client";
import { Sparkles } from "lucide-react";

export function GenerateBanner({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-violet-200/70 bg-linear-to-r from-violet-50 to-white px-6 py-5 dark:from-zinc-900 dark:to-black">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-violet-700 dark:text-violet-300">Generate Content</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Use AI to create {label.toLowerCase()}</div>
        </div>
        <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-300" />
      </div>
    </div>
  );
}

