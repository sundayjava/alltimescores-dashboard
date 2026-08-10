import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMedia, deleteMedia } from "@/services/media.service";
import { MediaFolder } from "@/types/media";
import { MEDIA_KEYS } from "./use-media";

export function useUploadMedia() {
    const queryClient = useQueryClient();
    const [progress, setProgress] = useState(0);

    const mutation = useMutation({
        mutationFn: ({ file, folder }: { file: File; folder: MediaFolder }) =>
            uploadMedia(file, folder, setProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.all });
            toast.success("Image uploaded successfully.");
            setProgress(0);
        },
        onError: () => {
            toast.error("Failed to upload image. Please try again.");
            setProgress(0);
        },
    });

    return { ...mutation, progress };
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