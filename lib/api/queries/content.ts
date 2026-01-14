import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Provider, type Content, type ContentListMeta } from "../client";

export const contentKeys = {
  all: ["content"] as const,
  list: (params: Record<string, unknown> | undefined) =>
    ["content", "list", params] as const,
  detail: (id: string) => ["content", "detail", id] as const,
  status: (jobId: string) => ["content", "status", jobId] as const,
};

export function useContentList(params?: {
  page?: number;
  limit?: number;
  status?: "pending" | "completed" | "failed";
  contentType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: contentKeys.list(params),
    queryFn: () => api.content.list(params),
  });
}

export function useContent(contentId: string) {
  return useQuery({
    queryKey: contentKeys.detail(contentId),
    queryFn: () => api.content.get(contentId),
    enabled: !!contentId,
  });
}

export function useJobStatus(jobId: string) {
  return useQuery({
    queryKey: contentKeys.status(jobId),
    queryFn: () => api.content.status(jobId),
    enabled: !!jobId,
    refetchInterval: 2000,
  });
}

export function useGenerateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      prompt: string;
      contentType: string;
      model?: string;
      provider?: Provider;
    }) => api.content.generate(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

export function useRegenerateContent(contentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body?: { provider?: Provider; model?: string }) =>
      api.content.regenerate(contentId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
    },
  });
}

export function usePatchContent(contentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title?: string; tags?: string[]; notes?: string }) =>
      api.content.patch(contentId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      qc.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) => api.content.delete(contentId),
    onMutate: async (contentId: string) => {
      await qc.cancelQueries({ queryKey: contentKeys.all });
      const listPairs = qc.getQueriesData<{ items: Content[]; meta?: ContentListMeta | undefined }>({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "content" && q.queryKey[1] === "list",
      });
      listPairs.forEach(([key, data]) => {
        if (!data) return;
        const nextItems = (data.items ?? []).filter((c) => (c.id ?? c._id) !== contentId);
        qc.setQueryData(key, { ...data, items: nextItems });
      });
      qc.removeQueries({ queryKey: contentKeys.detail(contentId) });
      return { listPairs };
    },
    onError: (_err, _contentId, ctx) => {
      ctx?.listPairs?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
}
