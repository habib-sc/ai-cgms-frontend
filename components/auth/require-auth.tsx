"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/stores/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { initialized, isAuthenticated, fetchSession } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      void fetchSession();
      return;
    }
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, fetchSession, router]);

  return <>{children}</>;
}
