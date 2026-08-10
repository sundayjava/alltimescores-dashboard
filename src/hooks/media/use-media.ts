import { useQuery } from "@tanstack/react-query";
import { getMedia } from "@/services/media.service";
import { MediaQueryParams } from "@/types/media";

export const MEDIA_KEYS = { 
  all: ["media"] as const,
  list: (params: MediaQueryParams) => ["media", "list", params] as const,
  detail: (id: string) => ["media", "detail", id] as const,
};

export function useMedia(params: MediaQueryParams = {}) {
  return useQuery({
    queryKey: MEDIA_KEYS.list(params),
    queryFn: () => getMedia(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}