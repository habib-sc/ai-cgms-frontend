"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../lib/stores/auth";
import { Eye, EyeOff } from "lucide-react";

export interface AuthFormProps {
  mode: "login" | "register";
  className?: string;
}

type Values = { name?: string; email: string; password: string };

export function AuthForm({ mode, className = "" }: AuthFormProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login, register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
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
            <span className="text-sm text-red-600">Name is required</span>
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
          <span className="text-sm text-red-600">Enter a valid email</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            {...formRegister("password", { required: true, minLength: 6 })}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <span className="text-sm text-red-600">Min 6 characters</span>
        )}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
