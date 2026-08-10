"use client";

import { useState } from "react";
import { Copy, Check, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Media } from "@/types/media";
import { getMediaUrl } from "@/services/media.service";

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface MediaCardProps {
    media: Media;
    canDelete: boolean;
    onDelete: (media: Media) => void;
}

export function MediaCard({ media, canDelete, onDelete }: MediaCardProps) {
    const [copied, setCopied] = useState(false);
    const fullUrl = getMediaUrl(media.url);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="group relative rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-150">
            {/* Thumbnail */}
            <div className="relative aspect-square bg-muted/40 overflow-hidden">
                <img
                    src={fullUrl}
                    alt={media.alt ?? media.originalName}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                        onClick={handleCopy}
                        title="Copy URL"
                        className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-lg border shadow-sm transition-colors",
                            copied
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                : "bg-card border-border hover:bg-muted"
                        )}
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </button>


                    <a href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open original"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-card border border-border shadow-sm hover:bg-muted transition-colors"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    {canDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(media); }}
                            title="Delete"
                            className="flex items-center justify-center h-8 w-8 rounded-lg bg-card border border-destructive/30 shadow-sm hover:bg-destructive/10 text-destructive transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="px-3 py-2.5">
                <p
                    className="text-xs font-medium text-foreground truncate leading-tight"
                    title={media.originalName}
                >
                    {media.originalName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                    <span>{formatSize(media.size)}</span>
                    {media.width && media.height && (
                        <>
                            <span>·</span>
                            <span className="tabular-nums">
                                {media.width}×{media.height}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}