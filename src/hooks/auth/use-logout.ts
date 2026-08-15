import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLoggedOut = () => {
    clearAuth();
    // Wipe all cached data — it belongs to the session that just ended,
    // and stale "me" data would make the login page think we're still in.
    queryClient.clear();
    router.push("/login");
  };

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: handleLoggedOut,
    onError: handleLoggedOut,
  });
}
