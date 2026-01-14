"use client";
import { Select } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import type { ContentListMeta } from "../../../../lib/api/client";

export function PaginationControls({
  meta,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: {
  meta?: ContentListMeta;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}) {
  if (!meta) return null;
  const start = Math.min((meta.page - 1) * meta.limit + 1, meta.total);
  const end = Math.min(meta.page * meta.limit, meta.total);
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {meta.total > 0 ? `Showing ${start}–${end} of ${meta.total}` : ""}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.page >= meta.pages}
          onClick={() => onPageChange(Math.min(meta.pages, page + 1))}
        >
          Next
        </Button>
        <Select
          className="w-full sm:w-28"
          defaultValue={String(limit)}
          onChange={(e) => {
            const v = Number(e.target.value || 12);
            onLimitChange(v);
            onPageChange(1);
          }}
        >
          <option value="6">6 / page</option>
          <option value="12">12 / page</option>
          <option value="24">24 / page</option>
        </Select>
      </div>
    </div>
  );
}
