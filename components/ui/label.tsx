"use client";
import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 ${className}`}
      {...props}
    />
  );
}
