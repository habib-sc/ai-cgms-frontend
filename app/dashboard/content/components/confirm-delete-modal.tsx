"use client";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Content",
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md rounded-md border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">{title}</div>
            <button
              className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Are you sure you want to delete this content? This action cannot be undone.
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

