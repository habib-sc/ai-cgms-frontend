"use client";
import { Card } from "../../../../components/ui/card";
import { formatMsToMinSec } from "../../../../lib/utils/datetime";
import { Loader2, Hourglass, Clock } from "lucide-react";

export function PendingResult({
  expectedAt,
  status,
  contentId,
  estimatedDelayMs,
}: {
  expectedAt?: string | null;
  status?:
    | "pending"
    | "processing"
    | "queued"
    | "running"
    | "failed"
    | "completed";
  contentId?: string | null;
  estimatedDelayMs?: number | null;
}) {
  const eta = expectedAt ? new Date(expectedAt).toLocaleString() : undefined;
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          {status === "queued" ? (
            <Hourglass className="h-4 w-4" />
          ) : status === "pending" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <div className="text-sm font-medium">
            {status === "queued"
              ? "Queued"
              : status === "pending"
              ? "Pending"
              : status === "running" || status === "processing"
              ? "Processing"
              : "Pending Result"}
          </div>
        </div>
        {contentId ? (
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            ID: {contentId}
          </div>
        ) : null}
      </div>
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="text-zinc-700 dark:text-zinc-300">
          {status === "failed"
            ? "Generation failed. Please try again."
            : status === "queued"
            ? "Job queued. Waiting for an available worker."
            : status === "pending"
            ? "Job is pending and will start shortly."
            : "Your content is being generated. It will appear here once ready."}
        </div>
        {eta ? (
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            ETA: {eta}
          </div>
        ) : null}
        {typeof estimatedDelayMs === "number" && estimatedDelayMs > 0 ? (
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Estimated delay: {formatMsToMinSec(estimatedDelayMs)}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
