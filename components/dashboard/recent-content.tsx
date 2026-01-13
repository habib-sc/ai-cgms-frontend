"use client";
import type { Content } from "../../lib/api/client";
import { Card } from "../ui/card";
import Link from "next/link";

export function RecentContent({ items, className = "" }: { items: Content[]; className?: string }) {
  const list = items.slice(0, 5);
  return (
    <Card className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Recent Content</div>
        <Link href="/content" className="text-xs text-zinc-600 hover:underline dark:text-zinc-400">View all</Link>
      </div>
      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">No content yet</div>
        ) : (
          list.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{c.title || "Untitled"}</div>
                <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">{c.contentType}</div>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

