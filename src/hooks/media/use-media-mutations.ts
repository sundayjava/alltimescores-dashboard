import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMedia, updateMedia, deleteMedia } from "@/services/media.service";
import { MediaFolder, MediaMetadata } from "@/types/media";
import { MEDIA_KEYS } from "./use-media";
import { getApiErrorMessage } from "@/lib/error-handler";

export function useUploadMedia() {
    const queryClient = useQueryClient();
    const [progress, setProgress] = useState(0);

    const mutation = useMutation({
        mutationFn: ({
            file,
            folder,
            metadata,
        }: {
            file: File;
            folder: MediaFolder;
            metadata?: MediaMetadata;
        }) => uploadMedia(file, folder, setProgress, metadata),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.all });
            toast.success("Image uploaded successfully.");
            setProgress(0);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to upload image. Please try again."));
            setProgress(0);
        },
    });

    return { ...mutation, progress };
}

export function useUpdateMedia() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, metadata }: { id: string; metadata: MediaMetadata }) =>
            updateMedia(id, metadata),
        onSuccess: (media) => {
            queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.all });
            queryClient.setQueryData(MEDIA_KEYS.detail(media.id), media);
            toast.success("Image details saved.");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to save image details."));
        },
    });
}

export function useDeleteMedia() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMedia(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.all });
            toast.success("Media deleted.");
        },
        onError: () => {
            toast.error("Failed to delete media. Please try again.");
        },
    });
}