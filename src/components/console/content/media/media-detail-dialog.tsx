"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Pencil, Copy, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EntityDialog } from "@/components/console/shared/entity-dialog";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/services/media.service";
import {
    hasAttribution,
    toMediaMetadataForm,
    validateMediaMetadata,
} from "@/lib/media-metadata";
import { Media, MediaMetadata, MediaMetadataField } from "@/types/media";
import { MediaMetadataFields } from "./media-metadata-fields";

interface MediaDetailDialogProps {
    open: boolean;
    media: Media | null;
    canEdit: boolean;
    isSaving: boolean;
    onSave: (id: string, metadata: MediaMetadata) => Promise<void> | void;
    onClose: () => void;
}

export function MediaDetailDialog({
    open,
    media,
    canEdit,
    isSaving,
    onSave,
    onClose,
}: MediaDetailDialogProps) {
    const [editing, setEditing] = useState(false);
    const [values, setValues] = useState<Required<MediaMetadata>>(() =>
        toMediaMetadataForm(media)
    );
    const [errors, setErrors] = useState<Partial<Record<MediaMetadataField, string>>>({});
    const [syncedFrom, setSyncedFrom] = useState<Media | null>(media);

    // Reload the form when a different image is opened, or after a save returns
    // fresh values — adjusted during render rather than in an effect.
    if (media !== syncedFrom) {
        setSyncedFrom(media);
        setValues(toMediaMetadataForm(media));
        setErrors({});
        setEditing(false);
    }

    if (!media) return null;

    const fullUrl = getMediaUrl(media.url);

    const handleChange = (field: MediaMetadataField, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleSave = async () => {
        const nextErrors = validateMediaMetadata(values);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        // Sending every field is safe: unchanged ones re-send the same value and
        // cleared inputs arrive as "", which is how the server clears a field.
        await onSave(media.id, values);
        setEditing(false);
    };

    return (
        <EntityDialog
            open={open}
            title={media.originalName}
            description={editing ? "Edit image details." : "Image details and attribution."}
            isPending={isSaving}
            onClose={onClose}
            dialogId="media-detail-dialog-title"
            maxWidth="max-w-xl"
        >
            <div className="space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="rounded-lg border border-border overflow-hidden">
                    <img
                        src={fullUrl}
                        alt={media.alt ?? media.originalName}
                        className="w-full max-h-56 object-contain bg-muted/30"
                    />
                </div>

                {editing ? (
                    <MediaMetadataFields
                        values={values}
                        errors={errors}
                        disabled={isSaving}
                        onChange={handleChange}
                    />
                ) : (
                    <MediaDetailView media={media} fullUrl={fullUrl} />
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                    {editing ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                                onClick={() => {
                                    setValues(toMediaMetadataForm(media));
                                    setErrors({});
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                {isSaving ? "Saving…" : "Save changes"}
                            </Button>
                        </>
                    ) : (
                        canEdit && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => setEditing(true)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit details
                            </Button>
                        )
                    )}
                </div>
            </div>
        </EntityDialog>
    );
}

function MediaDetailView({ media, fullUrl }: { media: Media; fullUrl: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="space-y-4 text-sm">
            {media.caption && <p className="text-foreground">{media.caption}</p>}

            {media.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {media.description}
                </p>
            )}

            <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1.5 text-xs">
                <dt className="text-muted-foreground">Alt text</dt>
                <dd className={media.alt ? "text-foreground" : "text-muted-foreground italic"}>
                    {media.alt || "Not set"}
                </dd>

                <dt className="text-muted-foreground">Folder</dt>
                <dd className="text-foreground">{media.folder}</dd>

                {media.width && media.height && (
                    <>
                        <dt className="text-muted-foreground">Dimensions</dt>
                        <dd className="text-foreground tabular-nums">
                            {media.width}×{media.height}
                        </dd>
                    </>
                )}
            </dl>

            {/* Attribution — a label may stand on its own without a link. */}
            {hasAttribution(media) && (
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Attribution
                    </p>
                    <AttributionLine
                        term="Source"
                        label={media.sourceLabel}
                        url={media.sourceUrl}
                    />
                    <AttributionLine
                        term="Licence"
                        label={media.licenseLabel}
                        url={media.licenseUrl}
                    />
                </div>
            )}

            <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy URL"}
                </Button>
                <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open original
                </a>
            </div>
        </div>
    );
}

function AttributionLine({
    term,
    label,
    url,
}: {
    term: string;
    label?: string | null;
    url?: string | null;
}) {
    if (!label && !url) return null;

    const text = label || url!;

    return (
        <p className="text-xs">
            <span className="text-muted-foreground">{term}: </span>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary underline underline-offset-2 hover:no-underline break-all"
                >
                    {text}
                </a>
            ) : (
                <span className="text-foreground">{text}</span>
            )}
        </p>
    );
}
