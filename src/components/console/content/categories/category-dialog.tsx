"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./category-form";
import { Category } from "@/types/category";
import { CreateCategorySchema, UpdateCategorySchema } from "@/schemas/category.schema";
import { cn } from "@/lib/utils";

interface CategoryDialogProps {
  open: boolean;
  category?: Category | null;
  allCategories: Category[];
  isPending: boolean;
  onSubmit: (values: CreateCategorySchema | UpdateCategorySchema) => void;
  onClose: () => void;
}

export function CategoryDialog({
  open,
  category,
  allCategories,
  isPending,
  onSubmit,
  onClose,
}: CategoryDialogProps) {
  const isEditing = !!category;
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-dialog-title"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "max-h-[90vh] flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div>
            <h2
              id="category-dialog-title"
              className="text-base font-semibold text-card-foreground"
            >
              {isEditing ? "Edit category" : "Create category"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update this category's details."
                : "Add a new category to organise your content."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5">
          <CategoryForm
            category={category}
            allCategories={allCategories}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}