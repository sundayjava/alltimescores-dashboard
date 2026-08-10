"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntityDialogProps {
  open: boolean;
  title: string;
  description: string;
  isPending: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dialogId?: string;
  maxWidth?: string;
}

export function EntityDialog({
  open,
  title,
  description,
  isPending,
  onClose,
  children,
  dialogId = "entity-dialog-title",
  maxWidth = "max-w-md",
}: EntityDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogId}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 id={dialogId} className="text-base font-semibold text-card-foreground">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
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
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}