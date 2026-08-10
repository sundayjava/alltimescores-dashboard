"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Globe, ChevronDown, Loader2, Eye, EyeOff, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/status-badge";
import { Content, ContentStatus } from "@/types/content";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { hasPermission } from "@/lib/permissions";
import { useAuthStore, selectUser } from "@/stores/auth-store";

interface EditorHeaderProps {
    content?: Content | null;
    isSaving: boolean;
    isPublishing: boolean;
    isDirty: boolean;
    onSave: () => void;
    onPublish: () => void;
    onUnpublish: () => void;
    onArchive: () => void;
    onRestoreDraft: () => void;
    onSchedule: () => void;
}

export function EditorHeader({
    content,
    isSaving,
    isPublishing,
    isDirty,
    onSave,
    onPublish,
    onUnpublish,
    onArchive,
    onRestoreDraft,
    onSchedule,
}: EditorHeaderProps) {
    const [actionsOpen, setActionsOpen] = useState(false);
    const user = useAuthStore(selectUser);
    const canPublish = user ? hasPermission(user.role, "publish_content") : false;

    const status = content?.status ?? "DRAFT";
    const isNew = !content;
    const isPublished = status === "PUBLISHED";
    const isArchived = status === "ARCHIVED";

    return (
        <header className="h-14 flex items-center justify-between border-b border-border bg-card px-3 sm:px-4 shrink-0 gap-2 sm:gap-4">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Link
                    href="/console/content/posts"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                </Link>

                <div className="h-4 w-px bg-border shrink-0" />

                <div className="flex items-center gap-2 min-w-0">
                    <StatusBadge status={status as ContentStatus} size="sm" />
                    {content?.publishedAt && isPublished && (
                        <span className="text-xs text-muted-foreground hidden md:inline truncate">
                            Published {format(new Date(content.publishedAt), "dd MMM yyyy")}
                        </span>
                    )}
                    {content?.scheduledAt && status === "SCHEDULED" && (
                        <span className="text-xs text-muted-foreground hidden md:inline truncate">
                            Scheduled for {format(new Date(content.scheduledAt), "dd MMM yyyy HH:mm")}
                        </span>
                    )}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Preview */}
                {content?.slug && (
                    <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex"
                        render={() => (
                            <a
                                href={`/${content.category.slug}/${content.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Eye className="h-3.5 w-3.5" />
                                    Preview
                                </div>
                            </a>
                        )} />
                )}

                {/* Save draft */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSave}
                    disabled={isSaving || (!isDirty && !isNew)}
                    className="gap-1.5 sm:min-w-22.5"
                >
                    {isSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Save className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">
                        {isNew ? "Save draft" : "Save"}
                    </span>
                </Button>

                {/* Publish / primary action */}
                {canPublish && !isArchived && (
                    <div className="flex items-center">
                        {!isPublished ? (
                            <Button
                                size="sm"
                                onClick={onPublish}
                                disabled={isPublishing || isNew}
                                className="gap-1.5 rounded-r-none sm:min-w-25"
                            >
                                {isPublishing ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Globe className="h-3.5 w-3.5" />
                                )}
                                <span className="hidden sm:inline">Publish</span>
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onUnpublish}
                                disabled={isPublishing}
                                className="gap-1.5 rounded-r-none sm:min-w-27.5"
                            >
                                <EyeOff className="h-3.5 w-3.5 sm:hidden" />
                                <span className="hidden sm:inline">Unpublish</span>
                            </Button>
                        )}

                        {/* Dropdown for more actions */}
                        <div className="relative">
                            <Button
                                size="sm"
                                variant={isPublished ? "outline" : "default"}
                                className={cn(
                                    "rounded-l-none border-l px-2",
                                    !isPublished && "border-l-primary-foreground/20"
                                )}
                                onClick={() => setActionsOpen((v) => !v)}
                                aria-label="More publish options"
                            >
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Button>

                            {actionsOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setActionsOpen(false)}
                                    />
                                    <div className="absolute right-0 top-9 z-20 min-w-40 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100">
                                        {!isPublished && (
                                            <button
                                                onClick={() => { onSchedule(); setActionsOpen(false); }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                            >
                                                <Calendar className="h-3.5 w-3.5" />
                                                Schedule…
                                            </button>
                                        )}
                                        {isPublished && (
                                            <button
                                                onClick={() => { onUnpublish(); setActionsOpen(false); }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                            >
                                                Unpublish
                                            </button>
                                        )}
                                        {isArchived ? (
                                            <button
                                                onClick={() => { onRestoreDraft(); setActionsOpen(false); }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                            >
                                                Restore to draft
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { onArchive(); setActionsOpen(false); }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                Archive
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}