import { useQuery } from "@tanstack/react-query";
import { getBroadcasts } from "@/services/broadcast.service";
import { BroadcastQueryParams } from "@/types/broadcast";

export const BROADCAST_KEYS = {
  all: ["broadcasts"] as const,
  list: (params: BroadcastQueryParams) => ["broadcasts", "list", params] as const,
};

export function useBroadcasts(params: BroadcastQueryParams = {}) {
  return useQuery({
    queryKey: BROADCAST_KEYS.list(params),
    queryFn: () => getBroadcasts(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}
