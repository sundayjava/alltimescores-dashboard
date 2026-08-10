import { useQuery } from "@tanstack/react-query";
import { getContents, getContentById } from "@/services/content.service";
import { getContentTypes } from "@/services/content-type.service";
import { getMedia } from "@/services/media.service";
import { ContentQueryParams, MediaQueryParams } from "@/types/content";

export const CONTENT_KEYS = {
  all: ["contents"] as const,
  list: (params: ContentQueryParams) => ["contents", "list", params] as const,
  detail: (id: string) => ["contents", "detail", id] as const,
  contentTypes: ["content-types"] as const,
  media: (params: MediaQueryParams) => ["media", params] as const,
};

export function useContents(params: ContentQueryParams = {}) {
  return useQuery({
    queryKey: CONTENT_KEYS.list(params),
    queryFn: () => getContents(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}

export function useContent(id: string) {
  return useQuery({
    queryKey: CONTENT_KEYS.detail(id),
    queryFn: () => getContentById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}
 
export function useContentTypes() {
  return useQuery({
    queryKey: CONTENT_KEYS.contentTypes,
    queryFn: () => getContentTypes(),
    staleTime: 1000 * 60 * 5,
  });
}

// export function useMedia(params: MediaQueryParams = {}) {
//   return useQuery({
//     queryKey: CONTENT_KEYS.media(params),
//     queryFn: () => getMedia(params),
//     placeholderData: (prev) => prev,
//     staleTime: 1000 * 30, 
//   });
// }