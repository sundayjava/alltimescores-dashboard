"use client";

import { ReactNode } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteDialogProps {
  open: boolean;
  isPending?: boolean;

  title: string;
  description: ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteDialog({
  open,
  isPending = false,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        {/* Close */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-7 w-7"
          onClick={onClose}
          disabled={isPending}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Body */}
        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <h2
            id="delete-dialog-title"
            className="text-base font-semibold text-card-foreground"
          >
            {title}
          </h2>

          <div
            id="delete-dialog-desc"
            className="mt-2 text-sm text-muted-foreground leading-relaxed"
          >
            {description}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="min-w-20 cursor-pointer"
            >
              {cancelText}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onConfirm}
              disabled={isPending}
              className="min-w-25 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}