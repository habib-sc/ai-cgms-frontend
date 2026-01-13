"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/stores/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchSession } = useAuthStore();

  useEffect(() => {
    const tokenPresent =
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken");
    if (!tokenPresent) {
      router.replace("/login");
      return;
    }
    if (!isAuthenticated && !isLoading) fetchSession();
  }, [isAuthenticated, isLoading, fetchSession, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const tokenPresent =
        typeof window !== "undefined" &&
        !!window.localStorage.getItem("accessToken");
      if (!tokenPresent) router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const tokenPresent =
    typeof window !== "undefined" &&
    !!window.localStorage.getItem("accessToken");
  if (!tokenPresent) return <div className="px-6 py-6 text-sm">Redirecting…</div>;
  if (!isAuthenticated && isLoading) return <div className="px-6 py-6 text-sm">Loading…</div>;
  return <>{children}</>;
}

