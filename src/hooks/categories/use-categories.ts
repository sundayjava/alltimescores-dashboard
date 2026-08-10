import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import { CategoryQueryParams } from "@/types/category";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  list: (params: CategoryQueryParams) => ["categories", "list", params] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories(params: CategoryQueryParams = {}) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => getCategories(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}

// Flat list of all categories for parent selector (no pagination)
export function useAllCategories() {
  return useQuery({
    queryKey: ["categories", "all-flat"],
    queryFn: () => getCategories({ limit: 100 }),
    staleTime: 1000 * 60,
  });
}