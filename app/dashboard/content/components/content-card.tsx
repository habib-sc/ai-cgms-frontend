"use client";
import type { Content } from "../../../../lib/api/client";
import { Card } from "../../../../components/ui/card";
import Link from "next/link";
import { formatDateTime } from "../../../../lib/utils/datetime";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./status-badge";

export function ContentCard({
  content,
  typeLabel,
}: {
  content: Content;
  typeLabel: string;
}) {
  const status: "pending" | "completed" | "failed" =
    content.status ??
    (content.contentError
      ? "failed"
      : content.output || content.generatedContent
      ? "completed"
      : "pending");
  const preview = content.generatedContent || content.output || content.prompt;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-md font-medium">
            {content.title || "Untitled"}
          </div>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatDateTime(content.createdAt)}
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {typeLabel}
        </span>
        <StatusBadge status={status} />
      </div>
      {preview ? (
        <div className="mt-3 text-xs text-zinc-600 line-clamp-4 dark:text-zinc-400">
          {preview}
        </div>
      ) : null}
      <div className="mt-3 flex items-center justify-between">
        <Link
          href={`/dashboard/content/${content.id ?? content._id}`}
          className="inline-flex items-center gap-1 text-md text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>Open</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
        <div className="flex items-center gap-2">
          {content.tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
