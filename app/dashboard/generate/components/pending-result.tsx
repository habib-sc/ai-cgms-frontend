"use client";
import { Card } from "../../../../components/ui/card";
import { Loader2 } from "lucide-react";

export function PendingResult({
  expectedAt,
  status,
  contentId,
}: {
  expectedAt?: string | null;
  status?: "pending" | "running" | "failed" | "completed";
  contentId?: string | null;
}) {
  const eta = expectedAt ? new Date(expectedAt).toLocaleString() : undefined;
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-sm font-medium">Pending Result</div>
        </div>
        {contentId ? (
          <div className="text-xs text-zinc-600 dark:text-zinc-400">ID: {contentId}</div>
        ) : null}
      </div>
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="text-zinc-700 dark:text-zinc-300">
          {status === "failed"
            ? "Generation failed. Please try again."
            : "Your content is being generated. It will appear here once ready."}
        </div>
        {eta ? (
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">ETA: {eta}</div>
        ) : null}
      </div>
    </Card>
  );
}

