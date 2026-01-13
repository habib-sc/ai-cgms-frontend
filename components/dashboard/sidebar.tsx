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

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <aside className={`flex h-full w-64 flex-col border-r border-zinc-200 bg-white/80 backdrop-blur dark:bg-black/60 dark:border-zinc-800 ${className}`}>
      <div className="px-4 py-3">
        <div className="text-sm font-semibold">Dashboard</div>
      </div>
      <nav className="flex-1 px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

