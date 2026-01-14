"use client";
import { useMemo } from "react";
import type { Content } from "../../lib/api/client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatDateTime } from "../../lib/utils/datetime";
import { CONTENT_TYPES } from "../../lib/constants/content-types";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

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
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {c.title || "Untitled"}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {typeLabels[c.contentType] ?? c.contentType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
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

function StatusBadge({
  status,
}: {
  status: "pending" | "completed" | "failed";
}) {
  if (status === "completed")
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
        <CheckCircle className="h-3 w-3" />
        <span>Completed</span>
      </div>
    );
  if (status === "failed")
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <AlertCircle className="h-3 w-3" />
        <span>Failed</span>
      </div>
    );
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
      <Clock className="h-3 w-3" />
      <span>Pending</span>
    </div>
  );
}
