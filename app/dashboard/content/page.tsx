"use client";
import { useMemo, useState } from "react";
import { useContentList } from "../../../lib/api/queries/content";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { CONTENT_TYPES } from "../../../lib/constants/content-types";
import Link from "next/link";
import { formatDateTime } from "../../../lib/utils/datetime";
import { AlertCircle, CheckCircle, Clock, ChevronRight } from "lucide-react";

export default function MyContentPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const { data, isLoading, error } = useContentList({
    page,
    limit,
    search: search || undefined,
    contentType: type || undefined,
  });
  const items = useMemo(() => {
    const arr = [...(data?.items ?? [])];
    arr.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return arr;
  }, [data]);
  const meta = data?.meta;
  const typeLabels = useMemo(() => {
    return Object.fromEntries(CONTENT_TYPES.map((t) => [t.id, t.label]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Content</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <Select
            defaultValue={type}
            onChange={(e) => setType(e.target.value || undefined)}
          >
            <option value="">All Types</option>
            {CONTENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-400">
          {(error as Error)?.message ?? "Failed to load content"}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">No content found</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Try adjusting filters or create new content.
              </div>
            </div>
            <Link href="/dashboard/generate">
              <Button size="sm">Generate</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, index) => {
              const status: "pending" | "completed" | "failed" =
                c.status ?? (c.contentError ? "failed" : c.output || c.generatedContent ? "completed" : "pending");
              const preview = c.generatedContent || c.output || c.prompt;
              const typeLabel = typeLabels[c.contentType] ?? c.contentType;
              return (
                <Card key={c.id ?? c._id ?? `${c.title}-${c.createdAt}-${index}`}> 
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {c.title || "Untitled"}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {typeLabel}
                        </span>
                        <StatusBadge status={status} />
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDateTime(c.createdAt)}
                    </div>
                  </div>
                  {preview ? (
                    <div className="mt-3 text-xs text-zinc-600 line-clamp-4 dark:text-zinc-400">
                      {preview}
                    </div>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      href={`/dashboard/content/${c.id ?? c._id}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <span>Open</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                    <div className="flex items-center gap-2">
                      {c.tags?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {meta && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {meta.total > 0
                  ? `Showing ${Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total}`
                  : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={meta.page >= meta.pages}
                  onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                >
                  Next
                </Button>
                <Select
                  className="w-28"
                  defaultValue={String(limit)}
                  onChange={(e) => {
                    const v = Number(e.target.value || 12);
                    setLimit(v);
                    setPage(1);
                  }}
                >
                  <option value="6">6 / page</option>
                  <option value="12">12 / page</option>
                  <option value="24">24 / page</option>
                </Select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "completed" | "failed" }) {
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
