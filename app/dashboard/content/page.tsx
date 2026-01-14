"use client";
import { useMemo, useState } from "react";
import { useContentList } from "../../../lib/api/queries/content";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { CONTENT_TYPES } from "../../../lib/constants/content-types";
import Link from "next/link";
import { formatDateTime } from "../../../lib/utils/datetime";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function MyContentPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | undefined>(undefined);
  const { data, isLoading } = useContentList({
    limit: 100,
    search: search || undefined,
    contentType: type || undefined,
  });
  const items = useMemo(() => {
    const arr = [...(data ?? [])];
    arr.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return arr;
  }, [data]);

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
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          No content found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, index) => (
            <Card key={c.id ?? c._id ?? `${c.title}-${c.createdAt}-${index}`}>
              <div className="flex items.start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {c.title || "Untitled"}
                  </div>
                  <div className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-400">
                    {c.contentType}
                  </div>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDateTime(c.createdAt)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/dashboard/content/${c.id ?? c._id}`}
                  className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  View
                </Link>
                <div className="flex items-center gap-3">
                  {c.tags?.length ? (
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {c.tags.slice(0, 3).join(", ")}
                    </div>
                  ) : null}
                  <StatusBadge status={c.status ?? (c.output ? "completed" : "pending")} />
                </div>
              </div>
            </Card>
          ))}
        </div>
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
