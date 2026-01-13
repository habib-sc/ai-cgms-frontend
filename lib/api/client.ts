// API client (frontend). Reads NEXT_PUBLIC_API_BASE_URL from .env.
// Uses credentials: "include" for cookie-based sessions.

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    credentials: "include",
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json() as Promise<T>;
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

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      apiFetch<User>("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      apiFetch<User>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    me: () => apiFetch<{ user: User | null }>("/v1/auth/me"),
  },
  content: {
    // POST /v1/content/generate (expects prompt + contentType)
    generate: (body: {
      prompt: string;
      contentType: string;
      model?: string;
      provider?: Provider;
    }) =>
      apiFetch<{ jobId: string }>("/v1/content/generate", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    // POST /v1/content/:contentId/regenerate (optional provider/model)
    regenerate: (
      contentId: string,
      body?: { provider?: Provider; model?: string }
    ) =>
      apiFetch<{ jobId: string }>(`/v1/content/${contentId}/regenerate`, {
        method: "POST",
        body: JSON.stringify(body ?? {}),
      }),
    status: (jobId: string) =>
      apiFetch<JobStatus>(`/v1/content/${jobId}/status`),
    get: (contentId: string) => apiFetch<Content>(`/v1/content/${contentId}`),
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
      return apiFetch<Content[]>(`/v1/content${suffix}`);
    },
    // PATCH /v1/content/:contentId (title, tags, notes)
    patch: (
      contentId: string,
      body: { title?: string; tags?: string[]; notes?: string }
    ) =>
      apiFetch<Content>(`/v1/content/${contentId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: (contentId: string) =>
      apiFetch<void>(`/v1/content/${contentId}`, { method: "DELETE" }),
  },
};
