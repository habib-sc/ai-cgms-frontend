"use client";
import { AuthForm } from "../../../components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
      <AuthForm mode="register" />
    </main>
  );
}
