import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createContentType,
  updateContentType,
  deleteContentType,
} from "@/services/content-type.service";
import {
  CreateContentTypeRequest,
  UpdateContentTypeRequest,
} from "@/types/content-type";
import { CONTENT_TYPE_KEYS } from "./use-content-types";

export function useCreateContentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContentTypeRequest) =>
      createContentType(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_TYPE_KEYS.all });
      toast.success(`Content type "${response.name}" created.`);
    },
    onError: () => {
      toast.error("Failed to create content type. Please try again.");
    },
  });
}

export function useUpdateContentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateContentTypeRequest;
    }) => updateContentType(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CONTENT_TYPE_KEYS.all });
      toast.success(`Content type "${response.name}" updated.`);
    },
    onError: () => {
      toast.error("Failed to update content type. Please try again.");
    },
  });
}

export function useDeleteContentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_TYPE_KEYS.all });
      toast.success("Content type deleted.");
    },
    onError: () => {
      toast.error("Failed to delete content type. Please try again.");
    },
  });
}