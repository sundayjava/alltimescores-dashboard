"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagForm } from "./tag-form";
import { cn } from "@/lib/utils";
import { CreateTagSchema, UpdateTagSchema } from "@/schemas/tag.schema";
import { Tag } from "@/types/tag";

interface TagDialogProps {
  open: boolean;
  tag?: Tag | null;
  isPending: boolean;
  onSubmit: (values: CreateTagSchema | UpdateTagSchema) => void;
  onClose: () => void;
}

export function TagDialog({
  open,
  tag,
  isPending,
  onSubmit,
  onClose,
}: TagDialogProps) {
  const isEditing = !!tag;

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-dialog-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2
              id="tag-dialog-title"
              className="text-base font-semibold text-card-foreground"
            >
              {isEditing ? "Edit tag" : "Create tag"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update the tag's name or description."
                : "Add a new tag to organise your content."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <TagForm
            tag={tag}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}