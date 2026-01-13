"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

export interface LandingHeroProps {
  title: string;
  subtitle: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  badge?: React.ReactNode;
  className?: string;
}

export function LandingHero({
  title,
  subtitle,
  primary,
  secondary,
  badge,
  className = "",
}: LandingHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mx-auto max-w-3xl px-6 text-center ${className}`}
    >
      {badge && <div>{badge}</div>}
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        {subtitle}
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href={primary.href}
          className="inline-flex h-11 items-center justify-center rounded-md bg-black px-5 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
}
