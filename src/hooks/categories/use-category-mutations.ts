import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";
import { CATEGORY_KEYS } from "./use-categories";
import { getApiErrorMessage } from "@/lib/error-handler";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => createCategory(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success(`Category "${response.name}" created.`);
    },
     onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create category."));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryRequest;
    }) => updateCategory(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success(`Category "${response.name}" updated.`);
    },
     onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update category."));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category deleted.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete category."));
    },
  });
}

