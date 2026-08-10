import { useQuery } from "@tanstack/react-query";
import { getContentTypes } from "@/services/content-type.service";
import { ContentTypeQueryParams } from "@/types/content-type";

export const CONTENT_TYPE_KEYS = {
  all: ["content-types"] as const,
  list: (params: ContentTypeQueryParams) =>
    ["content-types", "list", params] as const,
  detail: (id: string) => ["content-types", "detail", id] as const,
};

export function useContentTypes(params: ContentTypeQueryParams = {}) {
  return useQuery({
    queryKey: CONTENT_TYPE_KEYS.list(params),
    queryFn: () => getContentTypes(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}