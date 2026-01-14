"use client";
import { Card } from "../../../../components/ui/card";
import Link from "next/link";

export function GeneratedResult({ output }: { output?: string }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Generated Result</div>
        <Link href="/dashboard/content" className="text-xs text-zinc-600 hover:underline dark:text-zinc-400">
          View all
        </Link>
      </div>
      <div className="whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:bg-zinc-900 dark:border-zinc-800">
        {output || "No output available"}
      </div>
    </Card>
  );
}

