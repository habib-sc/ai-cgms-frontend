"use client";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export function StatusBadge({ status }: { status: "pending" | "completed" | "failed" }) {
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

