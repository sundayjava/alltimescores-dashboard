"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

interface CategoryDeleteDialogProps {
  open: boolean;
  category: Category | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CategoryDeleteDialog({
  open,
  category,
  isPending,
  onConfirm,
  onClose,
}: CategoryDeleteDialogProps) {
  if (!open || !category) return null;

  const childCount = category._count?.children ?? 0;
  const contentCount = category._count?.contents ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-7 w-7"
          onClick={onClose}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <h2 className="text-base font-semibold text-card-foreground">
            Delete &quot;{category.name}&quot;?
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {childCount > 0 ? (
              <>
                This category has{" "}
                <span className="font-medium text-foreground">
                  {childCount} {childCount === 1 ? "subcategory" : "subcategories"}
                </span>
                {contentCount > 0 && (
                  <>
                    {" "}and{" "}
                    <span className="font-medium text-foreground">
                      {contentCount} {contentCount === 1 ? "article" : "articles"}
                    </span>
                  </>
                )}
                . Deleting it may affect all of them. This cannot be undone.
              </>
            ) : contentCount > 0 ? (
              <>
                This category is attached to{" "}
                <span className="font-medium text-foreground">
                  {contentCount} {contentCount === 1 ? "article" : "articles"}
                </span>
                . This cannot be undone.
              </>
            ) : (
              "This category will be permanently removed. This cannot be undone."
            )}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="min-w-20"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onConfirm}
              disabled={isPending}
              className="min-w-30"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Delete category"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}