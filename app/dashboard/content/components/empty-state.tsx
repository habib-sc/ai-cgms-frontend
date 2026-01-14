"use client";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
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
  );
}

