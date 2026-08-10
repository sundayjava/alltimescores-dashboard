"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  CreateContentTypeSchema,
  UpdateContentTypeSchema,
  createContentTypeSchema,
  updateContentTypeSchema,
} from "@/schemas/content-type.schema";
import { ContentType } from "@/types/content-type";

interface ContentTypeFormProps {
  contentType?: ContentType | null;
  onSubmit: (values: CreateContentTypeSchema | UpdateContentTypeSchema) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ContentTypeForm({
  contentType,
  onSubmit,
  onCancel,
  isPending,
}: ContentTypeFormProps) {
  const isEditing = !!contentType;
  const schema = isEditing ? updateContentTypeSchema : createContentTypeSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm<CreateContentTypeSchema | UpdateContentTypeSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: contentType?.name ?? "",
      description: contentType?.description ?? "",
      icon: contentType?.icon ?? "",
      sortOrder: contentType?.sortOrder ?? undefined,
      ...(isEditing && { isActive: contentType?.isActive ?? true }),
    },
  });

  useEffect(() => {
    reset({
      name: contentType?.name ?? "",
      description: contentType?.description ?? "",
      icon: contentType?.icon ?? "",
      sortOrder: contentType?.sortOrder ?? undefined,
      ...(isEditing && { isActive: contentType?.isActive ?? true }),
    });
  }, [contentType, reset, isEditing]);

  const nameValue = watch("name") as string;

  const handleFormSubmit = (data: CreateContentTypeSchema | UpdateContentTypeSchema) => {
    // Convert empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      description: data.description?.trim() || undefined,
      icon: data.icon?.trim() || undefined,
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="ct-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ct-name"
          placeholder="e.g. News, Video, Analysis"
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
        <Label htmlFor="ct-description" className="text-sm font-medium">
          Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="ct-description"
          rows={3}
          placeholder="Brief description of this content type…"
          {...register("description")}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            errors.description && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Icon & Sort Order */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="ct-icon" className="text-sm font-medium">
            Icon{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="ct-icon"
            placeholder="e.g. newspaper"
            autoComplete="off"
            {...register("icon")}
            className={cn(
              "h-9 text-sm font-mono",
              errors.icon && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.icon && (
            <p className="text-xs text-destructive">{errors.icon.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ct-sort-order" className="text-sm font-medium">
            Sort order{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="ct-sort-order"
            type="number"
            min={0}
            placeholder="0"
            {...register("sortOrder", { valueAsNumber: true })}
            className={cn(
              "h-9 text-sm",
              errors.sortOrder && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.sortOrder && (
            <p className="text-xs text-destructive">{errors.sortOrder.message}</p>
          )}
        </div>
      </div>

      {/* isActive — edit only */}
      {isEditing && (
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <Checkbox
                id="ct-is-active"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
              />
              <div>
                <Label
                  htmlFor="ct-is-active"
                  className="text-sm font-medium cursor-pointer"
                >
                  Active
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inactive types are hidden from content creation.
                </p>
              </div>
            </div>
          )}
        />
      )}

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
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}