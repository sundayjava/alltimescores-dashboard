"use client";

import { Controller, Control, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ContentSchema } from "@/schemas/content.schema";
import { UserStub } from "@/types/content";

interface PanelSettingsProps {
  control: Control<ContentSchema>;
  register: UseFormRegister<ContentSchema>;
  authors: UserStub[];
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-none">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer border transition-colors mt-0.5",
          checked ? "border-primary bg-primary" : "border-input bg-transparent"
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 inline-block h-3.5 w-3.5 transition-transform",
            checked ? "translate-x-4 bg-primary-foreground" : "translate-x-0 bg-foreground/60"
          )}
        />
      </button>
    </div>
  );
}

export function PanelSettings({
  control,
  register,
  authors,
}: PanelSettingsProps) {
  return (
    <div className="space-y-4">
      {/* Author */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Author <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="authorId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => field.onChange(value)}
              items={authors.map((a) => ({
                value: a.id,
                label: `${a.firstName} ${a.lastName}`,
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author…" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Visibility */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Visibility
        </Label>
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) =>
                field.onChange(value as ContentSchema["visibility"])
              }
              items={[
                { value: "PUBLIC", label: "Public" },
                { value: "PRIVATE", label: "Private" },
                { value: "MEMBERS_ONLY", label: "Members only" },
              ]}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="MEMBERS_ONLY">Members only</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Toggles */}
      <div className="space-y-0 divide-y divide-border border border-border px-3">
        <Controller
          name="allowComments"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Allow comments"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Featured"
              description="Highlights this content on the homepage."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="isBreaking"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Breaking news"
              description="Shows a breaking news badge."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="isPinned"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Pinned"
              description="Keeps this content at the top of listings."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}