"use client";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { CONTENT_TYPES } from "../../../../lib/constants/content-types";

export function ContentHeader({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  type: string | undefined;
  onTypeChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold">My Content</h1>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-56"
        />
        <Select
          defaultValue={type}
          onChange={(e) => onTypeChange(e.target.value || undefined)}
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
  );
}
