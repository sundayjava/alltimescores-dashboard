"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Media } from "@/types/media";
import { cn } from "@/lib/utils";
import { MediaCard } from "./media-card";

interface MediaGridProps {
    media: Media[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
    search: string;
    canDelete: boolean;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onDelete: (media: Media) => void;
}

export function MediaGrid({
    media,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isFetching,
    search,
    canDelete,
    onSearchChange,
    onPageChange,
    onDelete,
}: MediaGridProps) {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                    placeholder="Search by filename…"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 h-9 text-sm"
                />
            </div>

            {/* Grid */}
            <div className={cn(isFetching && !isLoading && "opacity-70 transition-opacity")}>
                {isLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border overflow-hidden">
                                <div className="aspect-square bg-muted animate-pulse" />
                                <div className="px-3 py-2.5 space-y-1.5">
                                    <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                                    <div className="h-2.5 w-1/2 rounded bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex items-center justify-center py-20 rounded-xl border border-border bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            {search
                                ? `No media found for "${search}".`
                                : "No media yet. Upload your first image."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                        {media.map((item) => (
                            <MediaCard
                                key={item.id}
                                media={item}
                                canDelete={canDelete}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && total > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {start}–{end} of {total} files
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1 || isFetching}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground tabular-nums px-1">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages || isFetching}
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}