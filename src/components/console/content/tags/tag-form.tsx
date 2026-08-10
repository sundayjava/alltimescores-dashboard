"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreateTagSchema, UpdateTagSchema, updateTagSchema, createTagSchema } from "@/schemas/tag.schema";
import { Tag } from "@/types/tag";

interface TagFormProps {
  tag?: Tag | null;
  onSubmit: (values: CreateTagSchema | UpdateTagSchema) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function TagForm({ tag, onSubmit, onCancel, isPending }: TagFormProps) {
  const isEditing = !!tag;
  const schema = isEditing ? updateTagSchema : createTagSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateTagSchema | UpdateTagSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: tag?.name ?? "",
      description: tag?.description ?? "",
    },
  });

  // Reset form when tag prop changes (switching between create/edit)
  useEffect(() => {
    reset({
      name: tag?.name ?? "",
      description: tag?.description ?? "",
    });
  }, [tag, reset]);

  const nameValue = watch("name");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="tag-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tag-name"
          placeholder="e.g. Premier League"
          autoComplete="off"
          autoFocus
          {...register("name")}
          className={cn(
            "h-9 text-sm",
            errors.name && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {nameValue?.length ?? 0}/100 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="tag-description" className="text-sm font-medium">
          Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="tag-description"
          rows={3}
          placeholder="Brief description of what this tag represents…"
          {...register("description")}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            errors.description &&
              "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Actions */}
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
        <Button
          type="submit"
          size="sm"
          disabled={isPending || (isEditing && !isDirty)}
          className="min-w-22.5"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Create tag"
          )}
        </Button>
      </div>
    </form>
  );
}
