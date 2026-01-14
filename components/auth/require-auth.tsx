"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/stores/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { initialized, fetchSession } = useAuthStore();

  useEffect(() => {
    const hasToken =
      typeof window !== "undefined" &&
      !!window.localStorage.getItem("accessToken");
    if (!hasToken) {
      router.replace("/login");
      return;
    }
    if (!initialized) fetchSession();
  }, [initialized, fetchSession, router]);

  return <>{children}</>;
}
