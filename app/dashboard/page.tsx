"use client";
import { useMemo } from "react";
import { useContentList } from "../../lib/api/queries/content";
import { StatCard } from "../../components/dashboard/stat-card";
import { RecentContent } from "../../components/dashboard/recent-content";
import { CONTENT_TYPES } from "../../lib/constants/content-types";
import { Sparkles, FileText, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useContentList({ limit: 50 });
  const total = data?.length ?? 0;
  const recent = useMemo(() => {
    const arr = [...(data ?? [])];
    arr.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return arr;
  }, [data]);
  const byType = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of CONTENT_TYPES) map.set(t.id, 0);
    for (const c of data ?? [])
      map.set(c.contentType, (map.get(c.contentType) ?? 0) + 1);
    return map;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Content"
          value={isLoading ? "…" : total}
          icon={<BarChart3 className="h-6 w-6" />}
          className="border-violet-200/70"
        />
        <StatCard
          title="Most Common Type"
          value={isLoading ? "…" : mostCommon(byType)}
          icon={<FileText className="h-6 w-6" />}
          className="border-cyan-200/70"
        />
        <StatCard
          title="Quick Generate"
          value={
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Choose a type and start
            </span>
          }
          icon={<Sparkles className="h-6 w-6" />}
          className="border-amber-200/70"
        />
      </div>

      <RecentContent items={recent} limit={8} />
    </div>
  );
}

function mostCommon(map: Map<string, number>) {
  let best: { id: string; count: number } | null = null;
  for (const [id, count] of map) {
    if (!best || count > best.count) best = { id, count };
  }
  const found = CONTENT_TYPES.find((t) => t.id === (best?.id ?? ""));
  return found ? found.label : "—";
}
