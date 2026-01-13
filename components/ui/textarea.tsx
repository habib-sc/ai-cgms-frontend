"use client";
// Multi-line text area.

import * as React from "react";

// Use a type alias to avoid empty interface lint error.
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`flex min-h-[120px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:border-zinc-700 dark:ring-offset-black ${className}`}
        {...props}
      />
    );
  }
);
