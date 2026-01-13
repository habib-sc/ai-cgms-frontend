"use client";
import { Sparkles, PenLine, Bot, Rocket } from "lucide-react";
import { LandingHero } from "../components/landing/landing-hero";
import { LandingFeatures } from "../components/landing/landing-features";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-64 w-64 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute right-[10%] bottom-[10%] h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-3xl px-6">
        <LandingHero
          title="Create beautiful content in seconds"
          subtitle="Blog posts, product descriptions, social captions, email subjects, and ad copy — all in one place."
          primary={{ href: "/register", label: "Get Started" }}
          secondary={{ href: "/login", label: "Login" }}
          badge={
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-black/60 dark:text-zinc-300">
              <Sparkles className="h-4 w-4" />
              <span>AI Content Generator</span>
            </div>
          }
        />
        <LandingFeatures
          features={[
            {
              icon: <PenLine className="h-5 w-5" />,
              title: "Multiple Types",
              desc: "Outline, blog, product, social, email, ads",
            },
            {
              icon: <Bot className="h-5 w-5" />,
              title: "Smart AI",
              desc: "Choose provider and model, regenerate anytime",
            },
            {
              icon: <Rocket className="h-5 w-5" />,
              title: "Fast & Clean",
              desc: "Minimal, responsive, accessible by design",
            },
          ]}
        />
      </div>
    </main>
  );
}
