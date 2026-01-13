// API client (frontend). Reads NEXT_PUBLIC_API_BASE_URL from .env.
// Uses credentials: "include" for cookie-based sessions.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json() as Promise<T>;
}

// Minimal types (expand later)
export interface User { id: string; name: string; email: string; }
export interface Content {
  id: string; userId: string; type: string; title: string; tags: string[];
  prompt: string; output?: string; createdAt: string; updatedAt: string;
}
export interface JobStatus { jobId: string; status: "queued"|"running"|"succeeded"|"failed"; contentId?: string; error?: string; }

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      apiFetch<User>("/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      apiFetch<User>("/v1/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => apiFetch<{ user: User | null }>("/v1/auth/me"),
  },
  content: {
    generate: (body: { type: string; title: string; tags: string[]; prompt: string }) =>
      apiFetch<{ jobId: string }>("/v1/content/generate", { method: "POST", body: JSON.stringify(body) }),
    regenerate: (contentId: string) =>
      apiFetch<{ jobId: string }>(`/v1/content/${contentId}/regenerate`, { method: "POST" }),
    status: (jobId: string) => apiFetch<JobStatus>(`/v1/content/${jobId}/status`),
    get: (contentId: string) => apiFetch<Content>(`/v1/content/${contentId}`),
    list: (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));
      if (params?.search) qs.set("search", params.search);
      if (params?.type) qs.set("type", params.type);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return apiFetch<Content[]>(`/v1/content${suffix}`);
    },
    patch: (contentId: string, body: { title?: string; tags?: string[] }) =>
      apiFetch<Content>(`/v1/content/${contentId}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (contentId: string) => apiFetch<void>(`/v1/content/${contentId}`, { method: "DELETE" }),
  },
};

