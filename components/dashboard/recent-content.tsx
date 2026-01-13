"use client";
import type { Content } from "../../lib/api/client";
import { Card } from "../ui/card";
import Link from "next/link";
import { formatDateTime } from "../../lib/utils/datetime";

export function RecentContent({
  items,
  className = "",
  limit = 5,
}: {
  items: Content[];
  className?: string;
  limit?: number;
}) {
  const list = items.slice(0, limit);
  return (
    <Card className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Recent Content</div>
        <Link
          href="/dashboard/content"
          className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            No content yet
          </div>
        ) : (
          list.map((c, index) => (
            <div
              key={c.id ?? c._id ?? `${c.title}-${c.createdAt}-${index}`}
              className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {c.title || "Untitled"}
                </div>
                <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                  {c.contentType}
                </div>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDateTime(c.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
