import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTag, updateTag, deleteTag } from "@/services/tag.service";
import { CreateTagRequest, UpdateTagRequest } from "@/types/tag";
import { TAG_KEYS } from "./use-tags";

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTagRequest) => createTag(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: TAG_KEYS.all });
      toast.success(`Tag "${response.name}" created.`);
    },
    onError: () => {
      toast.error("Failed to create tag. Please try again.");
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTagRequest }) =>
      updateTag(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: TAG_KEYS.all });
      toast.success(`Tag "${response.name}" updated.`);
    },
    onError: () => {
      toast.error("Failed to update tag. Please try again.");
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_KEYS.all });
      toast.success("Tag deleted.");
    },
    onError: () => {
      toast.error("Failed to delete tag. Please try again.");
    },
  });
}