"use client";
import { Card } from "../ui/card";
import type { ReactNode } from "react";

export function StatCard({ title, value, icon, className = "" }: { title: string; value: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <Card className={`flex items-center justify-between ${className}`}>
      <div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </div>
      {icon ? <div className="text-zinc-500 dark:text-zinc-400">{icon}</div> : null}
    </Card>
  );
}

