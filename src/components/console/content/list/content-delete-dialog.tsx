"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Content } from "@/types/content";
import { cn } from "@/lib/utils";

interface ContentDeleteDialogProps {
    open: boolean;
    content: Content | null;
    isPending: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function ContentDeleteDialog({
    open,
    content,
    isPending,
    onConfirm,
    onClose,
}: ContentDeleteDialogProps) {
    if (!open || !content) return null;

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
                        Delete this content?
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="font-medium text-foreground">
                            &quot;{content.title}&quot;
                        </span>{" "}
                        will be permanently deleted. This cannot be undone.
                    </p>

                    {content.status === "PUBLISHED" && (
                        <p className="mt-2 text-xs text-destructive font-medium">
                            Warning: this content is currently live.
                        </p>
                    )}

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
                            className="min-w-27.5"
                        >
                            {isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                "Delete content"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}