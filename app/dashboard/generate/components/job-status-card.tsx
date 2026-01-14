"use client";
import { Card } from "../../../../components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { JobStatus } from "../../../../lib/api/client";

export function JobStatusCard({ jobId, status, isChecking }: { jobId: string; status?: JobStatus; isChecking: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Generation Status</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Job {jobId}</div>
        </div>
        {isChecking ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : status?.status === "completed" ? (
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        ) : status?.status === "failed" ? (
          <AlertCircle className="h-5 w-5 text-red-600" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
      </div>
    </Card>
  );
}

