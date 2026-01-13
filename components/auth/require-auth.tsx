"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/stores/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchSession } = useAuthStore();

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken");
    if (!hasToken) {
      router.replace("/login");
      return;
    }
    if (!isAuthenticated && !isLoading) fetchSession();
  }, [isAuthenticated, isLoading, fetchSession, router]);

  return <>{children}</>;
}
