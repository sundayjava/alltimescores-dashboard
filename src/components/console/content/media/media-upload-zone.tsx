"use client";

import { useState, useCallback, useRef, DragEvent } from "react";
import { Upload, X, ImageIcon, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { validateMediaMetadata } from "@/lib/media-metadata";
import {
    MediaFolder,
    MediaMetadata,
    MediaMetadataField,
    MEDIA_FOLDERS,
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE,
    EMPTY_MEDIA_METADATA,
} from "@/types/media";
import { MediaMetadataFields } from "./media-metadata-fields";

const FOLDER_OPTIONS: { value: MediaFolder; label: string }[] = [
    { value: MEDIA_FOLDERS.CONTENTS, label: "Contents" },
    { value: MEDIA_FOLDERS.CATEGORIES, label: "Categories" },
    { value: MEDIA_FOLDERS.USERS, label: "Users" },
    { value: MEDIA_FOLDERS.TEMP, label: "Temp" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface MediaUploadZoneProps {
    isPending: boolean;
    progress: number;
    onUpload: (file: File, folder: MediaFolder, metadata: MediaMetadata) => void;
    /** Folder the upload lands in. Also the initial value of the picker below. */
    defaultFolder?: MediaFolder;
    /** Hide the folder buttons when the caller already knows the destination. */
    showFolderSelector?: boolean;
    /** Start with the optional details section expanded. */
    defaultDetailsOpen?: boolean;
    /** Rendered above the upload button — e.g. a "cancel" action. */
    footer?: React.ReactNode;
    submitLabel?: string;
}

export function MediaUploadZone({
    isPending,
    progress,
    onUpload,
    defaultFolder = MEDIA_FOLDERS.CONTENTS,
    showFolderSelector = true,
    defaultDetailsOpen = false,
    footer,
    submitLabel = "Upload",
}: MediaUploadZoneProps) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [folder, setFolder] = useState<MediaFolder>(defaultFolder);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<Required<MediaMetadata>>({
        ...EMPTY_MEDIA_METADATA,
    });
    const [metadataErrors, setMetadataErrors] = useState<
        Partial<Record<MediaMetadataField, string>>
    >({});
    const [detailsOpen, setDetailsOpen] = useState(defaultDetailsOpen);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleMetadataChange = useCallback(
        (field: MediaMetadataField, value: string) => {
            setMetadata((prev) => ({ ...prev, [field]: value }));
            setMetadataErrors((prev) =>
                prev[field] ? { ...prev, [field]: undefined } : prev
            );
        },
        []
    );

    const handleSubmit = () => {
        if (!selectedFile) return;

        const errors = validateMediaMetadata(metadata);
        if (Object.keys(errors).length > 0) {
            setMetadataErrors(errors);
            setDetailsOpen(true);
            return;
        }

        // Blank values are fine to send — the server stores them as NULL.
        onUpload(selectedFile, folder, metadata);
    };

    const validate = (file: File): string | null => {
        if (!ALLOWED_IMAGE_TYPES.has(file.type))
            return "Only JPG, PNG, WEBP, and GIF images are allowed.";
        if (file.size > MAX_IMAGE_SIZE) return "File must be under 10 MB.";
        return null;
    };

    const handleFile = useCallback((file: File) => {
        const err = validate(file);
        if (err) { setError(err); return; }
        setError(null);
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleClear = () => {
        setSelectedFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-card-foreground">Upload image</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    JPG, PNG, WEBP, GIF · Max 10 MB
                </p>
            </div>

            {/* Drop zone / preview */}
            {selectedFile && preview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-44 object-contain bg-muted/30"
                    />
                    {!isPending && (
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 rounded-full bg-background/90 border border-border p-1 shadow-sm hover:bg-muted transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <div className="px-3 py-2 border-t border-border bg-card">
                        <p className="text-xs font-medium text-foreground truncate">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatSize(selectedFile.size)}</p>
                    </div>

                    {isPending && (
                        <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <div className="w-36 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground tabular-nums">{progress}%</p>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !isPending && inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-2.5 h-36 rounded-lg border-2 border-dashed cursor-pointer transition-colors select-none",
                        dragOver
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <ImageIcon className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Drop image here</p>
                        <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                className="hidden"
            />

            {error && <p className="text-xs text-destructive">{error}</p>}

            {/* Folder selector */}
            <div className={cn("space-y-2", !showFolderSelector && "hidden")}>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Folder
                </Label>
                <div className="flex flex-wrap gap-1.5">
                    {FOLDER_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFolder(value)}
                            disabled={isPending}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                folder === value
                                    ? "bg-accent text-accent-foreground"
                                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image details — all optional, collapsed until wanted */}
            <div className="rounded-lg border border-border">
                <button
                    type="button"
                    onClick={() => setDetailsOpen((open) => !open)}
                    aria-expanded={detailsOpen}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                >
                    <span className="text-xs font-medium text-foreground">
                        Image details{" "}
                        <span className="font-normal text-muted-foreground">· optional</span>
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform",
                            detailsOpen && "rotate-180"
                        )}
                    />
                </button>

                {detailsOpen && (
                    <div className="border-t border-border px-3 py-3">
                        <MediaMetadataFields
                            values={metadata}
                            errors={metadataErrors}
                            disabled={isPending}
                            onChange={handleMetadataChange}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {footer}
                <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!selectedFile || isPending}
                    className="flex-1 gap-2"
                >
                    {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Upload className="h-3.5 w-3.5" />
                    )}
                    {isPending ? "Uploading…" : submitLabel}
                </Button>
            </div>
        </div>
    );
}