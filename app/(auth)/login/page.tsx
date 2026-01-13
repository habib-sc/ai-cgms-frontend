"use client";
import { AuthForm } from "../../../components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
      <AuthForm mode="login" />
    </main>
  );
}
