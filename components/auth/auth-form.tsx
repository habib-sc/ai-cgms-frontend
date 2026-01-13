"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../lib/stores/auth";

export interface AuthFormProps {
  mode: "login" | "register";
  className?: string;
}

type Values = { name?: string; email: string; password: string };

export function AuthForm({ mode, className = "" }: AuthFormProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login, register } = useAuthStore();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const onSubmit = async (values: Values) => {
    if (mode === "login") {
      await login(values.email, values.password);
    } else {
      await register(values.name ?? "", values.email, values.password);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`mx-auto w-full max-w-sm space-y-4 ${className}`}
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {mode === "login" ? "Login" : "Create an account"}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? "Sign in to continue" : "Register to get started"}
        </p>
      </div>

      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            {...formRegister("name", { required: mode === "register" })}
          />
          {errors.name && (
            <span className="text-xs text-red-600">Name is required</span>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...formRegister("email", {
            required: true,
            pattern: /.+@.+\..+/,
          })}
        />
        {errors.email && (
          <span className="text-xs text-red-600">Enter a valid email</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...formRegister("password", { required: true, minLength: 6 })}
        />
        {errors.password && (
          <span className="text-xs text-red-600">Min 6 characters</span>
        )}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
