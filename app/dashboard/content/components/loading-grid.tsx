"use client";
import { Card } from "../../../../components/ui/card";

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

