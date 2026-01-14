"use client";
import { useMemo, useState } from "react";
import { useContentList } from "../../../lib/api/queries/content";
import { CONTENT_TYPES } from "../../../lib/constants/content-types";
import { ContentHeader } from "./components/content-header";
import { LoadingGrid } from "./components/loading-grid";
import { EmptyState } from "./components/empty-state";
import { ContentGrid } from "./components/content-grid";
import { PaginationControls } from "./components/pagination-controls";

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
      <ContentHeader
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
      />

      {isLoading ? (
        <LoadingGrid />
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-400">
          {(error as Error)?.message ?? "Failed to load content"}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ContentGrid items={items} typeLabels={typeLabels} />
          <PaginationControls
            meta={meta}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(v) => {
              setLimit(v);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
