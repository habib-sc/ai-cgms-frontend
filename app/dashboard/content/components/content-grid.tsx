"use client";
import type { Content } from "../../../../lib/api/client";
import { ContentCard } from "./content-card";

export function ContentGrid({ items, typeLabels }: { items: Content[]; typeLabels: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c, index) => (
        <ContentCard key={c.id ?? c._id ?? `${c.title}-${c.createdAt}-${index}`} content={c} typeLabel={typeLabels[c.contentType] ?? c.contentType} />
      ))}
    </div>
  );
}

