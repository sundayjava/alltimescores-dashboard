"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import Link from "next/link";
import {
    Search, X, ChevronLeft, ChevronRight,
    MoreHorizontal, Pencil, Trash2, Globe,
    Archive, RotateCcw, FileText, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Content, ContentStatus } from "@/types/content";
import { StatusBadge } from "../shared/status-badge";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import { useAuthStore, selectUser } from "@/stores/auth-store";

// ─── Row actions ──────────────────────────────────────────────────────────────
interface RowActionsProps {
    content: Content;
    onDelete: (content: Content) => void;
    onPublish: (id: string) => void;
    onUnpublish: (id: string) => void;
    onArchive: (id: string) => void;
    onRestore: (id: string) => void;
}

function RowActions({
    content,
    onDelete,
    onPublish,
    onUnpublish,
    onArchive,
    onRestore,
}: RowActionsProps) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const user = useAuthStore(selectUser);
    const canPublish = user ? hasPermission(user.role, "publish_content") : false;
    const canDelete = user ? hasPermission(user.role, "delete_content") : false;

    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuH = 200;
            setPos({
                top: spaceBelow < menuH + 8 ? rect.top - menuH - 4 : rect.bottom + 4,
                left: rect.right - 160,
            });
        }
        setOpen((v) => !v);
    };

    return (
        <div>
            <Button
                ref={btnRef}
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleOpen}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>

            {open &&
                createPortal(
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <div
                            className="fixed z-50 min-w-40 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <Link
                                href={`/editor/${content.id}/edit`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </Link>

                            {content.slug && (
                                <a
                                    href={`/${content.category.slug}/${content.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    View live
                                </a>
                            )}

                            {canPublish && (
                                <>
                                    {content.status !== "PUBLISHED" &&
                                        content.status !== "ARCHIVED" && (
                                            <button
                                                onClick={() => { onPublish(content.id); setOpen(false); }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                            >
                                                <Globe className="h-3.5 w-3.5" />
                                                Publish
                                            </button>
                                        )}
                                    {content.status === "PUBLISHED" && (
                                        <button
                                            onClick={() => { onUnpublish(content.id); setOpen(false); }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                        >
                                            Unpublish
                                        </button>
                                    )}
                                    {content.status !== "ARCHIVED" ? (
                                        <button
                                            onClick={() => { onArchive(content.id); setOpen(false); }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            <Archive className="h-3.5 w-3.5" />
                                            Archive
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { onRestore(content.id); setOpen(false); }}
                                            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                            Restore draft
                                        </button>
                                    )}
                                </>
                            )}

                            {canDelete && (
                                <button
                                    onClick={() => { onDelete(content); setOpen(false); }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </>,
                    document.body
                )}
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <tr className="border-b border-border">
            <td className="px-4 py-3">
                <div className="space-y-1.5">
                    <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                </div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
            </td>
            <td className="px-4 py-3 hidden lg:table-cell">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </td>
            <td className="px-4 py-3 hidden xl:table-cell">
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            </td>
            <td className="px-4 py-3 hidden xl:table-cell">
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            </td>
            <td className="px-4 py-3">
                <div className="h-7 w-7 rounded bg-muted animate-pulse ml-auto" />
            </td>
        </tr>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
    return (
        <tr>
            <td colSpan={6}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {hasFilters ? (
                        <>
                            <p className="text-sm font-medium">No content found</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try a different search or filter.
                            </p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
                                Clear filters
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium">No content yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create your first piece of content to get started.
                            </p>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ─── Status filter tabs ───────────────────────────────────────────────────────
const STATUS_FILTERS: { label: string; value: ContentStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Draft", value: "DRAFT" },
    { label: "Review", value: "REVIEW" },
    { label: "Approved", value: "APPROVED" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Archived", value: "ARCHIVED" },
];

// ─── Main table ───────────────────────────────────────────────────────────────
interface ContentTableProps {
    contents: Content[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
    search: string;
    statusFilter: ContentStatus | "ALL";
    onSearchChange: (v: string) => void;
    onPageChange: (p: number) => void;
    onStatusFilterChange: (s: ContentStatus | "ALL") => void;
    onDelete: (content: Content) => void;
    onPublish: (id: string) => void;
    onUnpublish: (id: string) => void;
    onArchive: (id: string) => void;
    onRestore: (id: string) => void;
}

export function ContentTable({
    contents,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isFetching,
    search,
    statusFilter,
    onSearchChange,
    onPageChange,
    onStatusFilterChange,
    onDelete,
    onPublish,
    onUnpublish,
    onArchive,
    onRestore,
}: ContentTableProps) {
    const [localSearch, setLocalSearch] = useState(search);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSearchChange(localSearch);
    };

    const handleClear = () => {
        setLocalSearch("");
        onSearchChange("");
        onStatusFilterChange("ALL");
    };

    const hasFilters = !!search || statusFilter !== "ALL";
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Status tabs */}
            <div className="flex overflow-x-auto border-b border-border px-4 gap-0.5">
                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => { onStatusFilterChange(f.value); onPageChange(1); }}
                        className={cn(
                            "px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
                            statusFilter === f.value
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
                <div className="relative flex-1 min-w-50 max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search content…"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 pl-8 pr-8 text-sm"
                    />
                    {localSearch && (
                        <button
                            onClick={handleClear}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    {isFetching && !isLoading && (
                        <span className="text-xs text-muted-foreground animate-pulse">Updating…</span>
                    )}
                    {total > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {total} {total === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left hidden md:table-cell text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left hidden xl:table-cell text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Author
                            </th>
                            <th className="px-4 py-3 text-left hidden xl:table-cell text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Date
                            </th>
                            <th className="px-4 py-3 w-13" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : contents.length === 0 ? (
                            <EmptyState hasFilters={hasFilters} onClear={handleClear} />
                        ) : (
                            contents.map((c) => (
                                <tr
                                    key={c.id}
                                    className={cn(
                                        "group hover:bg-muted/30 transition-colors",
                                        isFetching && "opacity-60"
                                    )}
                                >
                                    {/* Title */}
                                    <td className="px-4 py-3 max-w-75">
                                        <Link
                                            href={`/editor/${c.id}/edit`}
                                            className="block hover:text-primary transition-colors"
                                        >
                                            <p className="font-medium truncate leading-snug">{c.title}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {c.contentType.name} ·{" "}
                                                {c.readingTime ? `${c.readingTime} min read` : c.slug}
                                            </p>
                                        </Link>
                                        {/* Flags */}
                                        <div className="flex items-center gap-1 mt-1">
                                            {c.isFeatured && (
                                                <span className="text-[10px] font-medium rounded-sm bg-yellow-500/10 text-yellow-600 px-1 py-0.5">
                                                    Featured
                                                </span>
                                            )}
                                            {c.isBreaking && (
                                                <span className="text-[10px] font-medium rounded-sm bg-red-500/10 text-red-600 px-1 py-0.5">
                                                    Breaking
                                                </span>
                                            )}
                                            {c.isPinned && (
                                                <span className="text-[10px] font-medium rounded-sm bg-blue-500/10 text-blue-600 px-1 py-0.5">
                                                    Pinned
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <StatusBadge status={c.status as ContentStatus} />
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {c.category.name}
                                        </span>
                                    </td>

                                    {/* Author */}
                                    <td className="px-4 py-3 hidden xl:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {c.author.firstName} {c.author.lastName}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3 hidden xl:table-cell">
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                            {c.publishedAt
                                                ? format(new Date(c.publishedAt), "dd MMM yyyy")
                                                : format(new Date(c.createdAt), "dd MMM yyyy")}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right">
                                        <RowActions
                                            content={c}
                                            onDelete={onDelete}
                                            onPublish={onPublish}
                                            onUnpublish={onUnpublish}
                                            onArchive={onArchive}
                                            onRestore={onRestore}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                        {start}–{end} of {total}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1 || isFetching}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === "…" ? (
                                    <span key={`e-${idx}`} className="px-1 text-xs text-muted-foreground">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => onPageChange(p as number)}
                                        disabled={isFetching}
                                        className={cn(
                                            "h-7 w-7 rounded-md text-xs font-medium transition-colors",
                                            page === p
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages || isFetching}
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}