"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createCategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/schemas/category.schema";
import { Category } from "@/types/category";

interface CategoryFormProps {
  category?: Category | null;
  allCategories: Category[];
  onSubmit: (values: CreateCategorySchema | UpdateCategorySchema) => void;
  onCancel: () => void;
  isPending: boolean;
}

const PRESET_COLORS = [
  "#16a34a", "#2563eb", "#dc2626", "#d97706",
  "#7c3aed", "#db2777", "#0891b2", "#65a30d",
];

export function CategoryForm({
  category,
  allCategories,
  onSubmit,
  onCancel,
  isPending,
}: CategoryFormProps) {
  const isEditing = !!category;

  // isActive lives outside the form schema (only relevant on update)
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  // Always use createCategorySchema as the resolver type — all shared fields
  // are present. For updates, the parent strips empties and merges isActive.
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      color: category?.color ?? "",
      parentId: category?.parentId ?? "",
      sortOrder: category?.sortOrder ?? undefined,
    },
  });

  useEffect(() => {
    setIsActive(category?.isActive ?? true);
    reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      color: category?.color ?? "",
      parentId: category?.parentId ?? "",
      sortOrder: category?.sortOrder ?? undefined,
    });
  }, [category, reset]);

  const colorValue = watch("color");
  const nameValue = watch("name");

  // Merge isActive into the submitted values for edit mode
  const handleFormSubmit = (values: CreateCategorySchema) => {
    if (isEditing) {
      onSubmit({ ...values, isActive } as UpdateCategorySchema);
    } else {
      onSubmit(values);
    }
  };

  // Exclude self and direct children (prevent circular parent)
  const parentOptions = allCategories.filter((c) => {
    if (!category) return true;
    return c.id !== category.id && c.parentId !== category.id;
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cat-name"
          placeholder="e.g. Premier League"
          autoComplete="off"
          autoFocus
          {...register("name")}
          className={cn(
            "h-9 text-sm",
            errors.name && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {nameValue?.length ?? 0}/100
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-description" className="text-sm font-medium">
          Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="cat-description"
          rows={2}
          placeholder="Brief description…"
          {...register("description")}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          )}
        />
      </div>

      {/* Parent category */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-parent" className="text-sm font-medium">
          Parent category{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <select
              id="cat-parent"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || undefined)}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <option value="">— None (top level) —</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.parentId && (
          <p className="text-xs text-destructive">{errors.parentId.message}</p>
        )}
      </div>

      {/* Icon + Sort order */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cat-icon" className="text-sm font-medium">
            Icon{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="cat-icon"
            placeholder="e.g. football"
            {...register("icon")}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-sort" className="text-sm font-medium">
            Sort order
          </Label>
          <Input
            id="cat-sort"
            type="number"
            min={0}
            placeholder="0"
            {...register("sortOrder", { valueAsNumber: true })}
            className={cn(
              "h-9 text-sm",
              errors.sortOrder &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Color{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue("color", c, { shouldDirty: true })}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                colorValue === c
                  ? "border-foreground scale-110"
                  : "border-transparent"
              )}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
          <div className="flex items-center gap-1.5 ml-1">
            <div
              className="h-6 w-6 rounded-full border border-border shrink-0"
              style={{ backgroundColor: colorValue || "transparent" }}
            />
            <Input
              placeholder="#000000"
              {...register("color")}
              className={cn(
                "h-7 w-28 text-xs font-mono",
                errors.color &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
        </div>
        {errors.color && (
          <p className="text-xs text-destructive">{errors.color.message}</p>
        )}
      </div>

      {/* isActive toggle — edit only */}
      {isEditing && (
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground">
              Inactive categories won&apos;t appear on the site.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((v) => !v)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
              isActive ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg transition-transform",
                isActive ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
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
          className="min-w-27.5"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Create category"
          )}
        </Button>
      </div>
    </form>
  );
}