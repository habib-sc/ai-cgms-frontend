"use client";
import type { Content } from "../../../../lib/api/client";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useState } from "react";
import { usePatchContent } from "../../../../lib/api/queries/content";
import Link from "next/link";
import { formatDateTime } from "../../../../lib/utils/datetime";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteContent } from "@/lib/api/queries/content";
import { ConfirmDeleteModal } from "./confirm-delete-modal";

export function ContentCard({
  content,
  typeLabel,
}: {
  content: Content;
  typeLabel: string;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { mutateAsync: deleteAsync, isPending: isDeleting } =
    useDeleteContent();
  const status: "pending" | "processing" | "queued" | "completed" | "failed" =
    content.status ??
    (content.contentError
      ? "failed"
      : content.output || content.generatedContent
      ? "completed"
      : "pending");
  const preview = content.generatedContent || content.output || content.prompt;
  const id = content.id ?? content._id ?? "";
  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteAsync(id);
      toast.success("Content deleted");
      setShowDelete(false);
    } catch (err) {
      const msg = (err as Error)?.message ?? "Failed to delete";
      toast.error(msg);
    }
  };
  return (
    <Card>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm sm:text-md font-medium">
            {content.title || "Untitled"}
          </div>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatDateTime(content.createdAt)}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
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
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/dashboard/content/${content.id ?? content._id}`}
          className="inline-flex items-center gap-1 text-sm sm:text-md text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>Open</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {content.tags?.slice(0, 3).map((t, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
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

      {showEdit && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEdit(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-md rounded-md border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">Edit Content</div>
                <button
                  className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
                  onClick={() => setShowEdit(false)}
                >
                  Close
                </button>
              </div>
              <InlineContentMetaForm
                contentId={content.id ?? content._id ?? ""}
                defaultTitle={content.title}
                defaultTags={content.tags}
                defaultNotes={content.notes}
                onClose={() => setShowEdit(false)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </Card>
  );
}

function InlineContentMetaForm({
  contentId,
  defaultTitle,
  defaultTags,
  defaultNotes,
  onClose,
}: {
  contentId: string;
  defaultTitle: string;
  defaultTags: string[];
  defaultNotes?: string;
  onClose?: () => void;
}) {
  const [title, setTitle] = useState<string>(defaultTitle ?? "");
  const [tags, setTags] = useState<string>((defaultTags ?? []).join(", "));
  const [notes, setNotes] = useState<string>(defaultNotes ?? "");
  const { mutateAsync, isPending } = usePatchContent(contentId);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: { title?: string; tags?: string[]; notes?: string } = {};
    const nextTitle = title?.trim();
    const nextNotes = notes?.trim();
    const tagsArr = tags
      ?.split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (nextTitle !== (defaultTitle ?? "")) body.title = nextTitle || "";
    if (nextNotes !== (defaultNotes ?? "")) body.notes = nextNotes || "";
    if ((defaultTags ?? []).join(", ") !== (tags ?? ""))
      body.tags = tagsArr ?? [];
    if (!("title" in body) && !("notes" in body) && !("tags" in body)) return;
    try {
      await mutateAsync(body);
      toast.success("Content updated");
      onClose?.();
    } catch (err) {
      const msg = (err as Error)?.message ?? "Failed to update";
      toast.error(msg);
    }
  };

  const changed =
    (title ?? "") !== (defaultTitle ?? "") ||
    (notes ?? "") !== (defaultNotes ?? "") ||
    (tags ?? "") !== (defaultTags ?? []).join(", ");

  return (
    <form className="mt-2 space-y-3" onSubmit={onSubmit}>
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          maxLength={200}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="tag1, tag2"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          maxLength={1000}
          placeholder="Add notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isPending || !changed}>
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
