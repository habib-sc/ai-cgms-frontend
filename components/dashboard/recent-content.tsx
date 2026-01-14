"use client";
import { useMemo } from "react";
import type { Content } from "../../lib/api/client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatDateTime } from "../../lib/utils/datetime";
import { CONTENT_TYPES } from "../../lib/constants/content-types";
import { StatusBadge } from "@/app/dashboard/content/components/status-badge";

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
  const typeLabels = useMemo(
    () => Object.fromEntries(CONTENT_TYPES.map((t) => [t.id, t.label])),
    []
  );
  return (
    <Card className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-md font-medium">Recent Content</div>
        <Link
          href="/dashboard/content"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-md text-zinc-500 dark:text-zinc-400">
            No content yet
          </div>
        ) : (
          list.map((c, index) => (
            <div
              key={c.id ?? c._id ?? `${c.title}-${c.createdAt}-${index}`}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="min-w-0">
                <div className="truncate text-md font-medium">
                  {c.title || "Untitled"}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {typeLabels[c.contentType] ?? c.contentType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDateTime(c.createdAt)}
                </div>
                <StatusBadge
                  status={
                    c.status ??
                    (c.contentError
                      ? "failed"
                      : c.output || c.generatedContent
                      ? "completed"
                      : "pending")
                  }
                />
                <Link href={`/dashboard/content/${c.id ?? c._id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
