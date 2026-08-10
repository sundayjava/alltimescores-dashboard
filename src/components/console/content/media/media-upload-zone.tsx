"use client";

import { useState, useCallback, useRef, DragEvent } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    MediaFolder,
    MEDIA_FOLDERS,
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE,
} from "@/types/media";

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
    onUpload: (file: File, folder: MediaFolder) => void;
}

export function MediaUploadZone({ isPending, progress, onUpload }: MediaUploadZoneProps) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [folder, setFolder] = useState<MediaFolder>(MEDIA_FOLDERS.CONTENTS);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
            <div className="space-y-2">
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
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                size="sm"
                onClick={() => selectedFile && onUpload(selectedFile, folder)}
                disabled={!selectedFile || isPending}
                className="w-full gap-2"
            >
                {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Upload className="h-3.5 w-3.5" />
                )}
                {isPending ? "Uploading…" : "Upload"}
            </Button>
        </div>
    );
}