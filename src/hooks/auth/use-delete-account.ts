import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteMe } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { DeleteAccountRequest } from "@/types/auth";

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (payload?: DeleteAccountRequest) => deleteMe(payload),
    onSuccess: () => {
      clearAuth();
      // Wipe all cached data — it belongs to the account that just got
      // deleted, and stale "me" data would make the login page think
      // we're still authenticated.
      queryClient.clear();
      router.push("/login");
    },
  });
}
