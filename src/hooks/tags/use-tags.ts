import { getTags } from "@/services/tag.service";
import { TagQueryParams } from "@/types/tag";
import { useQuery } from "@tanstack/react-query";

export const TAG_KEYS = {
  all: ["tags"] as const,
  list: (params: TagQueryParams) => ["tags", "list", params] as const,
  detail: (id: string) => ["tags", "detail", id] as const,
};

export function useTags(params: TagQueryParams = {}) {
  return useQuery({
    queryKey: TAG_KEYS.list(params),
    queryFn: () => getTags(params),
    placeholderData: (prev) => prev, // keeps previous data while fetching next page
    staleTime: 1000 * 30, // 30 seconds
  });
}