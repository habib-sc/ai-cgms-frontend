"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Sparkles } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/content", label: "My Content", icon: FileText },
  { href: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className = "", variant = "desktop", onNavigate }: { className?: string; variant?: "desktop" | "mobile"; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside
      className={`${
        variant === "mobile"
          ? "fixed top-14 left-0 bottom-0 z-50 h-[calc(100vh-56px)] w-64 flex flex-col border-r border-zinc-200 bg-white/95 backdrop-blur dark:bg-black/80 dark:border-zinc-800"
          : "sticky top-14 h-[calc(100vh-56px)] w-64 flex flex-col border-r border-zinc-200 bg-white/80 backdrop-blur dark:bg-black/60 dark:border-zinc-800"
      } ${className}`}
    >
      {/* <s */}
      <nav className="flex-1 px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          const iconCls = active
            ? "h-4 w-4 text-violet-600 dark:text-violet-400"
            : "h-4 w-4 opacity-70";
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? " bg-zinc-100 text-zinc-900 dark:border-violet-500 dark:bg-zinc-800 dark:text-white font-medium"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className={iconCls} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
