"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePatchContent } from "@/lib/api/queries/content";
import { toast } from "react-hot-toast";

export function ContentMetaForm({
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
