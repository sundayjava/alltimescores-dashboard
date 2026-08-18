import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBroadcast,
  deactivateBroadcast,
  reactivateBroadcast,
  deleteBroadcast,
} from "@/services/broadcast.service";
import { CreateBroadcastRequest } from "@/types/broadcast";
import { BROADCAST_KEYS } from "./use-broadcasts";
import { getApiErrorMessage } from "@/lib/error-handler";

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBroadcastRequest) => createBroadcast(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BROADCAST_KEYS.all });
      toast.success("Broadcast published.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create broadcast."));
    },
  });
}

export function useDeactivateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BROADCAST_KEYS.all });
      toast.success("Broadcast deactivated.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to deactivate broadcast."));
    },
  });
}

export function useReactivateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivateBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BROADCAST_KEYS.all });
      toast.success("Broadcast reactivated.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to reactivate broadcast."));
    },
  });
}

export function useDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BROADCAST_KEYS.all });
      toast.success("Broadcast deleted.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete broadcast."));
    },
  });
}
