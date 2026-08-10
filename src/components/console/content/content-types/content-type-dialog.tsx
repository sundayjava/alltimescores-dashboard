"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentTypeForm } from "./content-type-form";
import {
  CreateContentTypeSchema,
  UpdateContentTypeSchema,
} from "@/schemas/content-type.schema";
import { ContentType } from "@/types/content-type";

interface ContentTypeDialogProps {
  open: boolean;
  contentType?: ContentType | null;
  isPending: boolean;
  onSubmit: (values: CreateContentTypeSchema | UpdateContentTypeSchema) => void;
  onClose: () => void;
}

export function ContentTypeDialog({
  open,
  contentType,
  isPending,
  onSubmit,
  onClose,
}: ContentTypeDialogProps) {
  const isEditing = !!contentType;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ct-dialog-title"
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
              id="ct-dialog-title"
              className="text-base font-semibold text-card-foreground"
            >
              {isEditing ? "Edit content type" : "Create content type"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update the content type details."
                : "Add a new type to categorise your content."}
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
          <ContentTypeForm
            contentType={contentType}
            onSubmit={onSubmit}
            onCancel={onClose}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}