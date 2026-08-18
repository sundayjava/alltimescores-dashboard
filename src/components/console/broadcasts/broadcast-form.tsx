"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createBroadcastSchema, CreateBroadcastSchema } from "@/schemas/broadcast.schema";
import { BroadcastLevel } from "@/types/broadcast";

const LEVEL_OPTIONS: { value: BroadcastLevel; label: string }[] = [
  { value: "INFO", label: "Info" },
  { value: "WARNING", label: "Warning" },
  { value: "CRITICAL", label: "Critical" },
];

interface BroadcastFormProps {
  onSubmit: (values: CreateBroadcastSchema) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function BroadcastForm({ onSubmit, onCancel, isPending }: BroadcastFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateBroadcastSchema>({
    resolver: zodResolver(createBroadcastSchema),
    defaultValues: { title: "", message: "", link: "", linkLabel: "", level: "INFO" },
  });

  const messageValue = watch("message");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="bc-title" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="bc-title"
          placeholder="e.g. Scheduled maintenance tonight"
          autoComplete="off"
          autoFocus
          {...register("title")}
          className={cn(
            "h-9 text-sm",
            errors.title && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bc-message" className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="bc-message"
          rows={3}
          placeholder="What should users know?"
          {...register("message")}
          className={cn(
            errors.message && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {messageValue?.length ?? 0}/2000
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="bc-link" className="text-sm font-medium">
            Link{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="bc-link"
            placeholder="https://…"
            autoComplete="off"
            {...register("link")}
            className={cn(
              "h-9 text-sm",
              errors.link && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.link && (
            <p className="text-xs text-destructive">{errors.link.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bc-link-label" className="text-sm font-medium">
            Link label{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="bc-link-label"
            placeholder="e.g. Read the policy"
            autoComplete="off"
            {...register("linkLabel")}
            className={cn(
              "h-9 text-sm",
              errors.linkLabel && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.linkLabel && (
            <p className="text-xs text-destructive">{errors.linkLabel.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bc-level" className="text-sm font-medium">
          Severity <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={LEVEL_OPTIONS}
            >
              <SelectTrigger id="bc-level" className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.level && (
          <p className="text-xs text-destructive">{errors.level.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending} className="min-w-30">
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Publish broadcast"}
        </Button>
      </div>
    </form>
  );
}
