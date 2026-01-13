"use client";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Children,
  isValidElement,
} from "react";
import type { PropsWithChildren, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export function Select({
  className = "",
  children,
  defaultValue,
  name,
  onChange,
}: PropsWithChildren<{
  className?: string;
  defaultValue?: string;
  name?: string;
  onChange?: (e: { target: { value: string } }) => void;
}>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    return Children.toArray(children)
      .map((child) => {
        if (!isValidElement(child)) return null;
        const props = child.props as {
          value: string;
          children?: ReactNode;
        };
        const v = props.value;
        const label = String(props.children ?? "");
        return { value: v, label };
      })
      .filter(Boolean) as { value: string; label: string }[];
  }, [children]);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input type="hidden" name={name} value={value ?? ""} />
      <button
        type="button"
        className="inline-flex h-10 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-black dark:border-zinc-700"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {selected ? selected.label : "Select..."}
        </span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-38 overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:bg-black dark:border-zinc-800">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800"
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                  onChange?.({ target: { value: opt.value } });
                }}
              >
                {isSelected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                <span className="truncate">{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
