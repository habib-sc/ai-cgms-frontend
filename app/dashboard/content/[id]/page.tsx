"use client";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useContent,
  useJobStatus,
  contentKeys,
} from "@/lib/api/queries/content";
import { formatDateTime } from "@/lib/utils/datetime";
import { GeneratedResult } from "@/app/dashboard/generate/components/generated-result";
import { PendingResult } from "@/app/dashboard/generate/components/pending-result";
import { StatusBadge } from "@/app/dashboard/content/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentEditModal } from "@/app/dashboard/content/components/content-edit-modal";
import { watchJob } from "@/lib/realtime/job-socket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { playNotifySound } from "@/lib/utils/notify";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteContent } from "@/lib/api/queries/content";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "@/app/dashboard/content/components/confirm-delete-modal";

export default function ContentDetailPage() {
  const params = useParams() as { id?: string };
  const id = params?.id ?? "";
  const { data: content, isLoading } = useContent(id);
  const jobId = content?.jobId ?? "";
  const { data: job } = useJobStatus(jobId);
  const qc = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useDeleteContent();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const token =
      (typeof window !== "undefined" &&
        (window.localStorage.getItem("accessToken") ||
          window.localStorage.getItem("access_token"))) ||
      "";
    const stop = watchJob(jobId, token, (payload) => {
      qc.setQueryData(contentKeys.status(jobId), payload);
      if (payload.status === "completed") {
        toast.success("Content updated");
        playNotifySound();
        qc.invalidateQueries({ queryKey: contentKeys.detail(id) });
        qc.invalidateQueries({ queryKey: contentKeys.all });
      }
    });
    return stop;
  }, [jobId, id, qc]);
  const status: "pending" | "processing" | "queued" | "completed" | "failed" =
    useMemo(() => {
      if (job?.status === "failed") return "failed";
      if (content?.contentError) return "failed";
      if (job?.status === "completed") return "completed";
      if (content?.status === "completed") return "completed";
      if (content?.output || content?.generatedContent) return "completed";
      if (job?.status === "processing") return "processing";
      if (job?.status === "queued") return "queued";
      return "pending";
    }, [job, content]);

  if (isLoading || !content) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-lg font-medium">
            {content.title || "Untitled"}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {content.contentType}
            </span>
            <StatusBadge status={status} />
            <Button
              variant="outline"
              size="xs"
              aria-label="Edit"
              onClick={() => setShowEdit(true)}
              title="Edit"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="xs"
              aria-label="Delete"
              onClick={() => setShowDelete(true)}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Created {formatDateTime(content.createdAt)}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Updated {formatDateTime(content.updatedAt)}
          </div>
        </div>
      </div>

      {status === "completed" ? (
        <GeneratedResult output={content.output ?? content.generatedContent} />
      ) : (
        <PendingResult
          expectedAt={undefined}
          status={job?.status}
          contentId={content.id ?? content._id}
        />
      )}

      <ContentEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        contentId={id}
        defaultTitle={content.title}
        defaultTags={content.tags}
        defaultNotes={content.notes}
      />

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => {
          try {
            await deleteAsync(id);
            toast.success("Content deleted");
            router.push("/dashboard/content");
          } catch (err) {
            const msg = (err as Error)?.message ?? "Failed to delete";
            toast.error(msg);
          }
        }}
        loading={isDeleting}
      />

      <Card>
        <div className="text-sm font-medium">Prompt</div>
        <div className="mt-2 whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:bg-zinc-900 dark:border-zinc-800">
          {content.prompt}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/content"
          className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Back to My Content
        </Link>
      </div>
    </div>
  );
}

// moved ContentMetaForm into components/content-meta-form.tsx and modal into components/content-edit-modal.tsx
