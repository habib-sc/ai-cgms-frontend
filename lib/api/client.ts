import axios, { type AxiosResponse, type AxiosRequestHeaders } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();
  const nextHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(method === "get" || method === "head"
      ? {}
      : { "Content-Type": "application/json" }),
  };
  if (typeof window !== "undefined") {
    const token =
      window.localStorage.getItem("accessToken") ||
      window.localStorage.getItem("access_token");
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
  }
  config.headers = {
    ...(config.headers as AxiosRequestHeaders),
    ...nextHeaders,
  } as AxiosRequestHeaders;
  return config;
});

async function unwrap<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
  const res = await p;
  return res.data;
}

// Minimal types (expand later)
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Content {
  id: string;
  userId: string;
  contentType: string; // align with backend naming
  title: string;
  tags: string[];
  prompt: string;
  output?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface JobStatus {
  jobId: string;
  status: "pending" | "running" | "completed" | "failed";
  contentId?: string;
  error?: string;
}

export type Provider = "gemini" | "openai";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      unwrap<ApiResponse<AuthData>>(http.post("/v1/auth/register", body)),
    login: (body: { email: string; password: string }) =>
      unwrap<ApiResponse<AuthData>>(http.post("/v1/auth/login", body)),
    me: () => unwrap<{ user: User | null }>(http.get("/v1/auth/me")),
  },
  content: {
    // POST /v1/content/generate (expects prompt + contentType)
    generate: (body: {
      prompt: string;
      contentType: string;
      model?: string;
      provider?: Provider;
    }) => unwrap<{ jobId: string }>(http.post("/v1/content/generate", body)),
    // POST /v1/content/:contentId/regenerate (optional provider/model)
    regenerate: (
      contentId: string,
      body?: { provider?: Provider; model?: string }
    ) =>
      unwrap<{ jobId: string }>(
        http.post(`/v1/content/${contentId}/regenerate`, body ?? {})
      ),
    status: (jobId: string) =>
      unwrap<JobStatus>(http.get(`/v1/content/${jobId}/status`)),
    get: (contentId: string) =>
      unwrap<Content>(http.get(`/v1/content/${contentId}`)),
    // GET /v1/content: page, limit, status, contentType, startDate, endDate, search
    list: (params?: {
      page?: number;
      limit?: number;
      status?: "pending" | "completed" | "failed";
      contentType?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));
      if (params?.status) qs.set("status", params.status);
      if (params?.contentType) qs.set("contentType", params.contentType);
      if (params?.startDate) qs.set("startDate", params.startDate);
      if (params?.endDate) qs.set("endDate", params.endDate);
      if (params?.search) qs.set("search", params.search);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return unwrap<Content[]>(http.get(`/v1/content${suffix}`));
    },
    // PATCH /v1/content/:contentId (title, tags, notes)
    patch: (
      contentId: string,
      body: { title?: string; tags?: string[]; notes?: string }
    ) => unwrap<Content>(http.patch(`/v1/content/${contentId}`, body)),
    delete: (contentId: string) =>
      unwrap<void>(http.delete(`/v1/content/${contentId}`)),
  },
};
