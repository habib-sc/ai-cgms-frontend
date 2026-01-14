"use client";
import Link from "next/link";
import {
  formatDateTime,
  formatMsToMinSec,
} from "../../../../lib/utils/datetime";

export function JobEnqueuedBanner({
  jobId,
  expectedAt,
  contentId,
  estimatedDelayMs,
}: {
  jobId: string;
  expectedAt?: string | null;
  contentId?: string | null;
  estimatedDelayMs?: number | null;
}) {
  return (
    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50 px-6 py-5 dark:bg-emerald-900/30">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Job enqueued successfully
          </div>
          <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            Job ID: <span className="font-mono">{jobId}</span>
          </div>
          {expectedAt && (
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Expected completion: {formatDateTime(expectedAt)}
            </div>
          )}
          {typeof estimatedDelayMs === "number" && estimatedDelayMs > 0 && (
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Estimated delay: {formatMsToMinSec(estimatedDelayMs)}
            </div>
          )}
          {contentId && (
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Content ID: <span className="font-mono">{contentId}</span> — will
              appear in My Content as pending
            </div>
          )}
        </div>
        <div className="text-xs">
          <Link
            href="/dashboard/content"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to My Content
          </Link>
        </div>
      </div>
    </div>
  );
}
