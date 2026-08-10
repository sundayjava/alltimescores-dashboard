import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
  scheduleContent,
  archiveContent,
  restoreDraft,
} from "@/services/content.service";
import { uploadMedia } from "@/services/media.service";
import { CreateContentRequest, UpdateContentRequest } from "@/types/content";
import { CONTENT_KEYS } from "./use-contents";

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContentRequest) => createContent(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      toast.success(`"${response.title}" saved as draft.`);
    },
    onError: () => {
      toast.error("Failed to create content. Please try again.");
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContentRequest }) =>
      updateContent(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success("Changes saved.");
    },
    onError: () => {
      toast.error("Failed to save changes.");
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      toast.success("Content deleted.");
    },
    onError: () => {
      toast.error("Failed to delete content.");
    },
  });
}

export function usePublishContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishContent(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success(`"${response.title}" is now live.`);
    },
    onError: () => {
      toast.error("Failed to publish content.");
    },
  });
}

export function useUnpublishContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unpublishContent(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success("Content unpublished.");
    },
    onError: () => {
      toast.error("Failed to unpublish content.");
    },
  });
}

export function useScheduleContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      scheduleContent(id, scheduledAt),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success("Content scheduled.");
    },
    onError: () => {
      toast.error("Failed to schedule content.");
    },
  });
}

export function useArchiveContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveContent(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success("Content archived.");
    },
    onError: () => {
      toast.error("Failed to archive content.");
    },
  });
}

export function useRestoreDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreDraft(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CONTENT_KEYS.detail(response.id),
      });
      toast.success("Restored to draft.");
    },
    onError: () => {
      toast.error("Failed to restore draft.");
    },
  });
}

// export function useUploadMedia() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
//       uploadMedia(file, folder), 
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["media"] });
//     },
//     onError: () => {
//       toast.error("Upload failed. Please try again.");
//     },
//   });
// }