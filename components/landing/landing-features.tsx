"use client";
import type { ReactNode } from "react";

export interface LandingFeature {
  icon: ReactNode;
  title: string;
  desc: string;
}

export interface LandingFeaturesProps {
  features: LandingFeature[];
  className?: string;
}

export function LandingFeatures({
  features,
  className = "",
}: LandingFeaturesProps) {
  return (
    <div className={`mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`}>
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-xl border border-zinc-200/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-black/60 dark:border-zinc-800"
        >
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            {f.icon}
            <span className="text-sm font-medium">{f.title}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
