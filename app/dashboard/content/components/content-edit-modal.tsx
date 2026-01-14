"use client";
import { ContentMetaForm } from "./content-meta-form";

export function ContentEditModal({
  open,
  onClose,
  contentId,
  defaultTitle,
  defaultTags,
  defaultNotes,
}: {
  open: boolean;
  onClose: () => void;
  contentId: string;
  defaultTitle: string;
  defaultTags: string[];
  defaultNotes?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md rounded-md border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">Edit Content</div>
            <button
              className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <ContentMetaForm
            contentId={contentId}
            defaultTitle={defaultTitle}
            defaultTags={defaultTags}
            defaultNotes={defaultNotes}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

