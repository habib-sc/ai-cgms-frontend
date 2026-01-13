"use client";
// Zustand auth store: session mirror + login/register.

import { create } from "zustand";
import { api, type User, type ApiResponse, type AuthData } from "../api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  fetchSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: undefined,

  // GET /v1/auth/me
  fetchSession: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const { user } = await api.auth.me();
      set({ user: user ?? null, isAuthenticated: !!user, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Session error";
      set({ error: msg, isLoading: false });
    }
  },

  // POST /v1/auth/login
  login: async (email, password) => {
    set({ isLoading: true, error: undefined });
    try {
      const resp = await api.auth.login({ email, password });
      const data = (resp as ApiResponse<AuthData>).data;
      const user = data.user;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login error";
      set({ error: msg, isLoading: false });
    }
  },

  // POST /v1/auth/register
  register: async (name, email, password) => {
    set({ isLoading: true, error: undefined });
    try {
      const resp = await api.auth.register({ name, email, password });
      const data = (resp as ApiResponse<AuthData>).data;
      const user = data.user;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Register error";
      set({ error: msg, isLoading: false });
    }
  },

  // Client-only logout (clear state). Add server logout later.
  clear: () => set({ user: null, isAuthenticated: false }),
}));
