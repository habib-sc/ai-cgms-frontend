"use client";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CONTENT_TYPES } from "../../../lib/constants/content-types";
import {
  useGenerateContent,
  useJobStatus,
  useContent,
} from "../../../lib/api/queries/content";
import { api } from "../../../lib/api/client";
// import Link from "next/link";
import { GenerateBanner } from "./components/generate-banner";
import { GenerateForm, type GenerateValues } from "./components/generate-form";
import { JobEnqueuedBanner } from "./components/job-enqueued-banner";
import { JobStatusCard } from "./components/job-status-card";
import { GeneratedResult } from "./components/generated-result";
import { PendingResult } from "./components/pending-result";

// GenerateValues type is imported from components/generate-form

export default function GeneratePage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const [expectedAt, setExpectedAt] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GenerateValues>({
    defaultValues: {
      contentType: CONTENT_TYPES[0].id,
      prompt: "",
      provider: "openai",
      model: "gpt-5-nano",
      title: "",
    },
  });

  const {
    mutateAsync,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateContent();
  const { data: status, isFetching: isChecking } = useJobStatus(jobId ?? "");
  const resolvedContentId =
    contentId ??
    (status?.status === "completed" ? status.contentId ?? null : null);
  const { data: content } = useContent(resolvedContentId ?? "");

  const [pendingTitle, setPendingTitle] = useState<string>("");

  useEffect(() => {
    const tryPatchTitle = async () => {
      if (!pendingTitle || !resolvedContentId) return;
      try {
        await api.content.patch(resolvedContentId, { title: pendingTitle });
        setPendingTitle("");
      } catch {
        // swallow; can retry later if needed
      }
    };
    void tryPatchTitle();
  }, [pendingTitle, resolvedContentId]);

  const onSubmit = async (values: GenerateValues) => {
    setJobId(null);
    setContentId(null);
    setExpectedAt(null);
    try {
      const result = await toast.promise(
        mutateAsync({
          prompt: values.prompt,
          contentType: values.contentType,
          provider: values.provider,
          model: values.model,
        }),
        {
          loading: "Enqueuing generation…",
          success: "Content generation job enqueued successfully.",
          error: "Failed to start generation",
        }
      );
      setJobId(result.jobId);
      if (result.contentId) setContentId(result.contentId);
      if (result.expectedCompletion) setExpectedAt(result.expectedCompletion);
      const t = (values.title ?? "").trim();
      if (t) {
        if (result.contentId) {
          try {
            await api.content.patch(result.contentId, { title: t });
          } catch {
            setPendingTitle(t);
          }
        } else {
          setPendingTitle(t);
        }
      }
      reset({ prompt: "", title: "" });
    } catch {
      toast.error("Failed to start generation");
    }
  };

  const [selectedContentType, setSelectedContentType] = useState<string>(
    CONTENT_TYPES[0].id
  );
  const contentTypeLabel = useMemo(() => {
    const found = CONTENT_TYPES.find((t) => t.id === selectedContentType);
    return found?.label ?? selectedContentType;
  }, [selectedContentType]);

  return (
    <div className="space-y-6">
      <GenerateBanner label={contentTypeLabel} />

      <GenerateForm
        contentTypes={CONTENT_TYPES}
        defaultContentType={selectedContentType}
        onContentTypeChange={(v) => {
          setSelectedContentType(v);
          setValue("contentType", v);
        }}
        onProviderChange={(v) => setValue("provider", v)}
        onModelChange={(v) => setValue("model", v)}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isGenerating={isGenerating}
        generateError={generateError}
      />

      {jobId && (
        <JobEnqueuedBanner
          jobId={jobId}
          expectedAt={expectedAt}
          contentId={resolvedContentId}
        />
      )}

      {jobId && (
        <JobStatusCard jobId={jobId} status={status} isChecking={isChecking} />
      )}

      {content && content.status === "completed" ? (
        <GeneratedResult output={content.output} />
      ) : jobId ? (
        <PendingResult
          expectedAt={expectedAt}
          status={status?.status}
          contentId={resolvedContentId}
        />
      ) : null}
    </div>
  );
}
