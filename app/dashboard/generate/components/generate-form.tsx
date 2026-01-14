"use client";
import type { Provider } from "../../../../lib/api/client";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select } from "../../../../components/ui/select";
import type { ContentType } from "../../../../lib/constants/content-types";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export interface GenerateValues {
  contentType: string;
  prompt: string;
  provider?: Provider;
  model?: string;
  title?: string;
}

export function GenerateForm({
  contentTypes,
  defaultContentType,
  onContentTypeChange,
  onProviderChange,
  onModelChange,
  register,
  errors,
  onSubmit,
  isGenerating,
  generateError,
}: {
  contentTypes: ReadonlyArray<ContentType>;
  defaultContentType: string;
  onContentTypeChange: (value: string) => void;
  onProviderChange: (value: Provider | undefined) => void;
  onModelChange: (value: string | undefined) => void;
  register: UseFormRegister<GenerateValues>;
  errors: FieldErrors<GenerateValues>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isGenerating: boolean;
  generateError?: unknown;
}) {
  return (
    <Card>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select
              defaultValue={defaultContentType}
              onChange={(e) => onContentTypeChange(e.target.value)}
            >
              {contentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              defaultValue="openai"
              onChange={(e) =>
                onProviderChange((e.target.value || undefined) as Provider)
              }
            >
              <option value="openai">OpenAI</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              defaultValue="gpt-5-nano"
              onChange={(e) => onModelChange(e.target.value || undefined)}
            >
              <option value="gpt-5-nano">gpt-5-nano</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input placeholder="Give it a helpful title" {...register("title")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Prompt</Label>
          <textarea
            className="min-h-32 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-black dark:border-zinc-700"
            placeholder="Describe what you want to generate with context, keywords, tone, etc."
            {...register("prompt", { required: true, minLength: 10 })}
          />
          {errors.prompt && (
            <span className="text-xs text-red-600">
              Enter at least 10 characters
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate</span>
              </>
            )}
          </Button>
          {generateError ? (
            <div className="inline-flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to start generation</span>
            </div>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
