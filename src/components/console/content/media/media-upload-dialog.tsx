"use client";

import { EntityDialog } from "@/components/console/shared/entity-dialog";
import { MediaUploadZone } from "./media-upload-zone";
import { MediaFolder } from "@/types/media";

interface MediaUploadDialogProps {
    open: boolean;
    isPending: boolean;
    progress: number;
    onUpload: (file: File, folder: MediaFolder) => void;
    onClose: () => void;
}

export function MediaUploadDialog({
    open,
    isPending,
    progress,
    onUpload,
    onClose,
}: MediaUploadDialogProps) {
    return (
        <EntityDialog
            open={open}
            title="Upload media"
            description="Drag and drop an image or click to browse. JPG, PNG, WEBP, GIF · Max 10 MB."
            isPending={isPending}
            onClose={onClose}
            dialogId="media-upload-dialog-title"
            maxWidth="max-w-lg"
        >
            <MediaUploadZone
                isPending={isPending}
                progress={progress}
                onUpload={onUpload}
            />
        </EntityDialog>
    );
}