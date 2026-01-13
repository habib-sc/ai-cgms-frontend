"use client";
// Accessible label.

import * as React from "react";

// Use a type alias to avoid empty interface lint error.
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 ${className}`}
      {...props}
    />
  );
}
